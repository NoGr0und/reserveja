# Reserveja – Sistema de Reservas

Projeto [Next.js](https://nextjs.org) com autenticação completa, layout condicional e fluxo pronto para produção. Toda a documentação foi condensada neste README para facilitar manutenção e consulta.

## Sumário

1. [Visão geral](#visão-geral)
2. [Início rápido](#início-rápido)
3. [Instalação detalhada](#instalação-detalhada)
4. [Scripts disponíveis](#scripts-disponíveis)
5. [Stack e dependências](#stack-e-dependências)
6. [Arquitetura e autenticação](#arquitetura-e-autenticação)
7. [Layouts, rotas e experiência](#layouts-rotas-e-experiência)
8. [Testes e validação](#testes-e-validação)
9. [Solução de problemas](#solução-de-problemas)
10. [Checklist pós-instalação](#checklist-pós-instalação)

---

## Visão geral

- Aplicação de reservas com dashboard privado, páginas de login/cadastro e sidebar condicional.
- Contexto global controla autenticação, persistência e feedback visual de carregamento.
- Rotas `/api/auth/login` e `/api/auth/register` conectadas ao Postgres via Prisma e hash scrypt.
- Layout baseado em App Router (`frontend/src/app`) com componentes reutilizáveis (Radix, Tailwind, shadcn).
- Documentação consolidada substitui os antigos `AUTH_SYSTEM.md` e `INSTALACAO.md`.

---

## Estrutura de pastas

```
frontend/          # App Next.js (src, public, configs)
backend/prisma/    # Schema, migrations e seed do banco
backend/src/       # Lógica de domínio (services, Prisma helper, util de senhas)
conexoes/          # Materiais de ambiente (.env.example, AJUSTES.md)
package.json       # Scripts raiz que orquestram frontend e Prisma
Dockerfile         # Build/execução considerando a nova estrutura
```

---

## Início rápido

```bash
cp .env.example .env         # configure DATABASE_URL, NEXTAUTH_SECRET etc.
npm install
npm run dev                  # http://localhost:3000
```

---

## Instalação detalhada

### Pré-requisitos

- Node.js 18.20.0+
- npm 9+
- Git para clonar o repositório

### Passo a passo

```bash
git clone <url-do-repositorio>
cd reserveja
npm install
npm run dev        # desenvolvimento
npm run build
npm start          # produção
```

 Ambiente padrão: `http://localhost:3000` (desenvolvimento e produção).
- Copie `.env.example` para `.env` na raiz e ajuste as variáveis. O frontend lê esse mesmo arquivo via symlink `frontend/.env` (não há `.env.local` para evitar duplicação).

---

## Scripts disponíveis

```bash
npm run dev                # servidor Next.js (frontend/)
npm run build              # build otimizado para produção
npm run start              # executa a build em produção
npm run lint               # verificação ESLint no frontend
npm run prisma:generate    # gera o client Prisma (backend/prisma/schema.prisma)
npm run prisma:migrate     # cria/aplica migration em dev
npm run prisma:migrate:deploy # aplica migrations em produção
npm run prisma:seed        # roda o seed configurado no Prisma
npm install      # instala dependências
npm ci           # instalação determinística (CI/CD)
```

- `npm run prisma:seed` — cria/atualiza o super admin padrão no banco.

---

## Stack e dependências

**Framework e core**
- `next@15.5.2`, `react@19.1.0`, `react-dom@19.1.0`, `typescript@^5`

**UI e estilo**
- `@radix-ui/react-label`, `@radix-ui/react-select`, `lucide-react`
- `tailwindcss@^4`, `clsx`, `tailwind-merge`, `class-variance-authority`

**Autenticação**
- `next-auth@4.24.11`, `jsonwebtoken@9.0.2`, `@types/jsonwebtoken`
- `node:crypto (scrypt)` para hash e validação de senha

Todas as dependências já estão configuradas e com tipagens incluídas.

---

## Banco de dados e Prisma

- Banco Postgres administrado pelo EasyPanel ou qualquer provedor compatível.
- Prisma configurado em `backend/prisma/schema.prisma`; o client é criado em `backend/src/lib/prisma.ts` e consumido via `@backend/*` nas rotas.
- Migração única de base em `backend/prisma/migrations/20250102120000_initial_schema/migration.sql`.
- Variável obrigatória: `DATABASE_URL=postgresql://usuario:senha@host:porta/banco`.
  - Use `.env` na raiz em desenvolvimento; em produção/CI prefira variáveis de ambiente (ou o mesmo `.env` se o provedor permitir).
- Comandos principais:
  - `npm run prisma:generate` — sincroniza o client.
  - `npm run prisma:migrate` — aplica migrations no banco apontado pelo `.env.local` (ou `DATABASE_URL` exportado).
  - `npm run prisma:migrate:deploy` — aplica migrations em produção (usa `DATABASE_URL` do ambiente).
  - `npm run prisma:seed` — registra/atualiza o super admin (usa `SUPERADMIN_*` do ambiente).

### Ambientes (dev e prod) com Prisma

- Desenvolvimento: configure `DATABASE_URL` no `.env` (raiz). Rode `npm run prisma:migrate` e `npm run prisma:seed`.
- Produção: defina `DATABASE_URL` via variável de ambiente (ou `.env` se o provedor permitir). Rode `npm run prisma:migrate:deploy` antes de iniciar a aplicação e opcionalmente `npm run prisma:seed` se precisar do super admin.
- Para alternar entre bancos, troque o valor de `DATABASE_URL` conforme o ambiente. Não guarde segredos no repositório; mantenha apenas `.env.example` com placeholders.

### Template EasyPanel

1. Crie um serviço Postgres pelo painel e copie o `DATABASE_URL`.
2. Abra o editor SQL do EasyPanel, cole o conteúdo de `backend/prisma/templates/easypanel-users.sql` e execute para gerar a tabela `User`.
3. Configure a variável `DATABASE_URL` no container Next.js (ou `.env.local`) usando as credenciais do banco criado.
4. Opcional: execute `npx prisma db pull --schema ./backend/prisma/schema.prisma` para validar o schema após importar o template.

Senhas são persistidas usando `scrypt` (módulo `node:crypto`) e nunca retornadas pela API; as rotas `/api/auth/register` e `/api/auth/login` operam diretamente no Postgres.

---

## Arquitetura e autenticação

### Fluxo principal

```
Usuário → Login/Cadastro → AuthContext → localStorage → Dashboard
           │
           ├─ Sidebar condicional decide layout
           └─ ProtectedRoute valida sessão antes de renderizar
```

### Estrutura essencial

```
frontend/
├─ src/
│  ├─ contexts/                 # Estado global (usuário, loading, login, logout)
│  ├─ app/                      # Páginas, layouts e rotas Next (consumindo serviços do backend)
│  └─ components/               # UI e helpers
└─ public/                      # Assets estáticos

backend/
├─ prisma/                      # Schema, migrations e seed
└─ src/
   ├─ lib/                      # Prisma client e util de senha
   └─ services/                 # Lógicas de domínio usadas pelas rotas (auth, serviços, clientes, dashboard, agendamentos)
```

### Componentes-chave

| Componente | Responsabilidades principais |
| ---------- | ---------------------------- |
| `AuthContext` | Persiste sessão no `localStorage`, expõe `login`, `logout`, `user`, `isAuthenticated`, `isLoading` |
| `ProtectedRoute` | Verifica autenticação antes de renderizar páginas sensíveis e redireciona para `/login` |
| `ConditionalLayout` | Oculta sidebar em rotas públicas (`/login`, `/cadastro`) e a exibe no dashboard |
| Páginas de Auth | Validam formulário, exibem estados de carregamento e disparam métodos do contexto |
| API Routes | Endpoints `/api/auth/*` ligados ao Postgres via Prisma e hash scrypt |

### Fluxo de autenticação

1. Usuário envia credenciais -> `AuthContext.login`.
2. Serviço chama `/api/auth/login`, valida no backend (Prisma) e grava token/usuário no navegador.
3. `ProtectedRoute` libera dashboard enquanto `ConditionalLayout` ativa sidebar.
4. `logout()` limpa sessão e redireciona para `/login`.

---

## Layouts, rotas e experiência

- **Sidebar condicional**: escondida em login/cadastro, visível no dashboard, com ação de logout.
- **Proteção de rotas**: dashboards e páginas sensíveis usam `ProtectedRoute`.
- **Estados de carregamento**: feedback visual durante autenticação para evitar cliques duplicados.
- **Persistência**: dados básicos salvos no `localStorage` para garantir sessão após reload.

---

## Testes e validação

1. `npm run dev` e aguarde `Ready - started server on 0.0.0.0:3000`.
2. Acesse `http://localhost:3000/login` e use `admin@super.com` / `Adm1n@36579`.
3. Confirme:
   - Sidebar oculta nas telas públicas.
   - Sidebar visível no dashboard e logout funcionando.
   - Redirecionamentos automáticos conforme autenticado/não autenticado.
   - Cadastros recém-criados aparecem na tabela `User` (consulta via EasyPanel SQL ou `npx prisma studio --schema ./backend/prisma/schema.prisma`).

---

## Solução de problemas

| Problema | Solução |
| -------- | ------- |
| `Module not found` | `rm -rf node_modules package-lock.json && npm install` |
| Porta 3000 em uso | `npm run dev -- -p 3001` |
| Avisos de hidratação | Garanta Node.js 18.20.0+ e reinstale dependências |
| Erros Prisma/Postgres | Confirme `DATABASE_URL`, se o serviço está ativo no EasyPanel e execute `npm run prisma:migrate:deploy` |
| Login/Cadastro falha após importar backup | Reaplique `backend/prisma/templates/easypanel-users.sql`, rode `npm run prisma:seed` e confirme que `passwordHash` foi gerado pelo utilitário scrypt |

---

## Checklist pós-instalação

- Servidor responde em `http://localhost:3000`.
- Login/cadastro funcionam com redirecionamento correto.
- Dashboard protegido e sidebar condicional habilitada.
- Banco Postgres acessível (`DATABASE_URL` configurada e tabela `User` existente).
- Lint (`npm run lint`) sem erros.

---

Este README concentra toda a documentação anterior. Ajuste livremente as seções conforme o projeto evoluir.
