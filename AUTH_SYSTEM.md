# 🔐 Sistema de Autenticação - Reserveja

> **Documentação completa do sistema de autenticação, controle de rotas e sidebar condicional**

---

## 📋 Índice Rápido

- [🎯 Visão Geral](#-visão-geral)
- [🏗️ Arquitetura do Sistema](#️-arquitetura-do-sistema)
- [📁 Estrutura de Arquivos](#-estrutura-de-arquivos)
- [🔧 Componentes Implementados](#-componentes-implementados)
- [🛡️ Sistema de Autenticação](#️-sistema-de-autenticação)
- [🎨 Controle de Layout](#-controle-de-layout)
- [🔒 Proteção de Rotas](#-proteção-de-rotas)
- [📱 Páginas e Funcionalidades](#-páginas-e-funcionalidades)
- [🧪 Como Testar](#-como-testar)
- [🚀 Migração para Produção](#-migração-para-produção)
- [📊 Diagramas do Sistema](#-diagramas-do-sistema)

---

## 🎯 Visão Geral

Sistema completo de autenticação implementado com as seguintes funcionalidades:

- ✅ **Sidebar condicional** - Ocultada em login/cadastro, visível no dashboard
- ✅ **Autenticação temporária** - Usuário padrão para testes
- ✅ **Proteção de rotas** - Redirecionamento automático baseado em autenticação
- ✅ **Fluxo completo** - Login → Dashboard → Logout → Login
- ✅ **Persistência** - Dados salvos no localStorage
- ✅ **Loading states** - Feedback visual durante operações

---

## 🏗️ Arquitetura do Sistema

### **Fluxo Principal**
```
Usuário → Login/Cadastro → AuthContext → localStorage → Dashboard
   ↓
Sidebar Condicional → Rota atual → Layout apropriado
   ↓
Proteção de Rotas → Verificação → Redirecionamento
```

### **Componentes Principais**
- **AuthContext** - Gerenciamento global de autenticação
- **ConditionalLayout** - Controle da sidebar baseado na rota
- **ProtectedRoute** - Proteção de páginas sensíveis
- **Páginas de Auth** - Login e cadastro integrados

---

## 📁 Estrutura de Arquivos

```
src/
├── 📁 contexts/
│   └── 🔧 AuthContext.tsx              # Contexto global de autenticação
├── 📁 components/
│   ├── 🎨 ConditionalLayout.tsx        # Layout condicional (sidebar)
│   ├── 🛡️ ProtectedRoute.tsx           # Proteção de rotas
│   └── 📁 ui/
│       ├── 🏷️ label.tsx                # Componente Label
│       └── 📋 select.tsx               # Componente Select
├── 📁 app/
│   ├── 🔧 layout.tsx                   # Layout principal (atualizado)
│   ├── 📁 login/
│   │   ├── 📄 page.tsx                # Página de login (atualizada)
│   │   └── 📁 services/
│   │       └── 🔧 authService.ts      # Serviços de login (legado)
│   ├── 📁 cadastro/
│   │   ├── 📄 page.tsx                # Página de cadastro (atualizada)
│   │   └── 📁 services/
│   │       └── 🔧 authService.ts      # Serviços de cadastro (legado)
│   ├── 📁 dashboard/
│   │   ├── 📄 page.tsx                # Dashboard (protegido)
│   │   └── 📁 services/
│   │       └── 📄 page.tsx            # Serviços (protegido)
│   ├── 📁 api/auth/
│   │   ├── 📁 login/
│   │   │   └── 🔧 route.ts            # API endpoint login
│   │   └── 📁 register/
│   │       └── 🔧 route.ts            # API endpoint cadastro
│   └── 📁 components/
│       └── 🎨 sd.tsx                  # Sidebar (atualizada com logout)
```

---

## 🔧 Componentes Implementados

### 1. **AuthContext.tsx** - Contexto Global de Autenticação

**Localização:** `src/contexts/AuthContext.tsx`

**Funcionalidades:**
```typescript
// Estado gerenciado:
- user: User | null           // Dados do usuário logado
- isAuthenticated: boolean    // Status de autenticação
- isLoading: boolean         // Estado de carregamento

// Funções principais:
- login(email, password)     // Realizar login
- register(userData)         // Realizar cadastro
- logout()                   // Fazer logout
```

**Usuário Temporário:**
```typescript
Email: admin@exemplo.com
Senha: 123456
```

**TODO para Produção:**
- Substituir por JWT tokens reais
- Integrar com banco de dados
- Implementar hash de senhas (bcrypt)
- Adicionar validação de email única

**Correções de Hidratação:**
- Adicionado `suppressHydrationWarning` no layout principal
- Verificações `typeof window !== 'undefined'` para localStorage
- Prevenção de diferenças entre servidor e cliente

### 2. **ConditionalLayout.tsx** - Layout Condicional

**Localização:** `src/components/ConditionalLayout.tsx`

**Lógica Implementada:**
```typescript
const hideSidebarRoutes = ['/login', '/cadastro'];
const shouldHideSidebar = hideSidebarRoutes.includes(pathname);
```

**Comportamento:**
- **Rotas sem sidebar:** `/login`, `/cadastro`
- **Rotas com sidebar:** Todas as outras (dashboard, serviços, etc.)

### 3. **ProtectedRoute.tsx** - Proteção de Rotas

**Localização:** `src/components/ProtectedRoute.tsx`

**Funcionalidades:**
- Redirecionamento automático para `/login`
- Loading state durante verificação
- Proteção de páginas sensíveis

**Páginas Protegidas:**
- `/dashboard`
- `/dashboard/services`

### 4. **Componentes UI Adicionados**

- **Label** (`src/components/ui/label.tsx`)
- **Select** (`src/components/ui/select.tsx`)

---

## 🛡️ Sistema de Autenticação

### **Fluxo de Autenticação**

```
1. Usuário acessa /login
2. AuthContext verifica isAuthenticated
3. Se false, exibe formulário
4. Usuário insere credenciais
5. login(email, password) é chamado
6. Credenciais são validadas
7. Dados são salvos no localStorage
8. isAuthenticated se torna true
9. Redirecionamento para /dashboard
```

### **Persistência de Dados**

```typescript
// Dados salvos no localStorage:
{
  "id": "1",
  "name": "Admin Usuário",
  "email": "admin@exemplo.com",
  "company": "Empresa Admin",
  "plan": "profissional"
}
```

### **Estados de Autenticação**

```
Não Logado → Login → Logado → Logout → Não Logado
     ↓         ↓        ↓        ↓
   /login   Validação  /dashboard  /login
```

---

## 🎨 Controle de Layout

### **Sidebar Condicional**

| Rota | Sidebar | Layout |
|------|---------|--------|
| `/login` | ❌ Ocultada | Layout limpo |
| `/cadastro` | ❌ Ocultada | Layout limpo |
| `/dashboard` | ✅ Visível | Layout completo |
| `/dashboard/services` | ✅ Visível | Layout completo |

### **Implementação**

```typescript
// ConditionalLayout.tsx
const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

if (shouldHideSidebar) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}

return (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <SidebarTrigger />
      {children}
    </SidebarInset>
  </SidebarProvider>
);
```

---

## 🔒 Proteção de Rotas

### **Comportamento**

```
Usuário acessa rota protegida → Verifica autenticação → Não autenticado? → Redireciona para /login
                                                      → Autenticado? → Exibe página
```

### **Implementação**

```typescript
// ProtectedRoute.tsx
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, isLoading, router]);
```

---

## 📱 Páginas e Funcionalidades

### 1. **Login** (`/login`)

**Campos:**
- 📧 Email (obrigatório)
- 🔒 Senha (obrigatório)

**Características:**
- 🎨 Botão azul (`bg-blue-400 text-white`)
- ✅ Validação de campos
- ❌ Tratamento de erros
- 🔗 Link para cadastro
- 🔄 Redirecionamento automático

### 2. **Cadastro** (`/cadastro`)

**Campos:**
- 👤 Nome Completo (obrigatório)
- 📧 Email (obrigatório)
- 🔒 Senha (mínimo 6 caracteres)
- 🏢 Nome da Empresa (obrigatório)
- 📱 Número (obrigatório)
- 📋 Plano (Básico, Profissional, Empresarial)

**Características:**
- 🎨 Botão azul (`bg-blue-400 text-white`)
- ✅ Validação completa
- 📋 Dropdown de planos
- ❌ Tratamento de erros
- ✅ Mensagens de sucesso
- 🔗 Link para login
- 🔄 Login automático após cadastro

### 3. **Dashboard** (`/dashboard`)

**Características:**
- 🛡️ Protegida com `ProtectedRoute`
- 🎨 Sidebar visível
- 👤 Nome do usuário na sidebar
- 🚪 Botão de logout funcional

### 4. **Serviços** (`/dashboard/services`)

**Características:**
- 🛡️ Protegida com `ProtectedRoute`
- 🎨 Sidebar visível
- 📋 Interface de gerenciamento

---

## 🧪 Como Testar

### **Credenciais de Teste**
```
Email: admin@exemplo.com
Senha: 123456
```

### **Fluxo de Teste Completo**

#### **1. Teste de Login**
```bash
# 1. Acesse a página de login
http://localhost:3000/login

# 2. Use as credenciais:
Email: admin@exemplo.com
Senha: 123456

# 3. Verifique o redirecionamento para /dashboard
# 4. Verifique se a sidebar está visível
```

#### **2. Teste de Cadastro**
```bash
# 1. Acesse a página de cadastro
http://localhost:3000/cadastro

# 2. Preencha todos os campos
# 3. Selecione um plano
# 4. Verifique o redirecionamento para /dashboard
# 5. Verifique se ficou logado automaticamente
```

#### **3. Teste de Proteção de Rotas**
```bash
# 1. Acesse diretamente sem estar logado
http://localhost:3000/dashboard

# 2. Deve ser redirecionado para /login
# 3. Faça login
# 4. Deve ser redirecionado de volta para /dashboard
```

#### **4. Teste de Logout**
```bash
# 1. Estando logado, clique no menu do usuário na sidebar
# 2. Clique em "Sair"
# 3. Deve ser redirecionado para /login
# 4. Verifique se a sidebar foi ocultada
```

#### **5. Teste de Sidebar Condicional**
```bash
# Rotas SEM sidebar:
http://localhost:3000/login     # ❌ Sem sidebar
http://localhost:3000/cadastro  # ❌ Sem sidebar

# Rotas COM sidebar:
http://localhost:3000/dashboard           # ✅ Com sidebar
http://localhost:3000/dashboard/services  # ✅ Com sidebar
```

---

## 🚀 Migração para Produção

### **🔧 Implementações Necessárias**

#### **1. Autenticação Real**
```typescript
// Substituir em AuthContext.tsx:
- Usuário hardcoded → JWT tokens reais
- localStorage → Cookies seguros
- Validação simples → Hash de senhas (bcrypt)
- Email único → Validação no banco de dados
```

#### **2. Integração com Banco de Dados**
```typescript
// Criar APIs reais:
POST /api/auth/login      # Login com validação no banco
POST /api/auth/register   # Cadastro com hash de senha
POST /api/auth/logout     # Logout com invalidação de token
GET  /api/auth/me         # Dados do usuário autenticado
POST /api/auth/refresh    # Refresh token
```

#### **3. Google Auth Integration**
```typescript
// Implementar NextAuth.js:
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  // Configurações adicionais...
})
```

#### **4. Middleware de Autenticação**
```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Lógica de middleware
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

### **📋 Checklist de Migração**

#### **Backend/Database**
- [ ] Configurar banco de dados (PostgreSQL/MongoDB)
- [ ] Criar tabela de usuários
- [ ] Implementar hash de senhas (bcrypt)
- [ ] Configurar JWT tokens
- [ ] Implementar refresh tokens
- [ ] Adicionar validação de email única

#### **Autenticação Externa**
- [ ] Configurar Google OAuth
- [ ] Implementar NextAuth.js
- [ ] Configurar variáveis de ambiente
- [ ] Testar fluxo de autenticação

#### **Segurança**
- [ ] Implementar HTTPS
- [ ] Configurar CORS
- [ ] Adicionar rate limiting
- [ ] Implementar CSRF protection
- [ ] Configurar cookies seguros

#### **UX/UI**
- [ ] Melhorar loading states
- [ ] Adicionar animações de transição
- [ ] Implementar mensagens de erro específicas
- [ ] Adicionar "Remember me"
- [ ] Implementar auto-logout por inatividade

---

## 📊 Diagramas do Sistema

### **🔄 Fluxo de Autenticação**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Usuário   │───▶│  Login Page  │───▶│ AuthContext │
└─────────────┘    └──────────────┘    └─────────────┘
                           │                    │
                           ▼                    ▼
                   ┌──────────────┐    ┌─────────────┐
                   │  Validação   │    │localStorage │
                   └──────────────┘    └─────────────┘
                           │                    │
                           ▼                    ▼
                   ┌──────────────┐    ┌─────────────┐
                   │  Sucesso?    │───▶│ Dashboard   │
                   └──────────────┘    └─────────────┘
```

### **🎨 Controle de Layout**
```
┌─────────────────┐
│  Rota Atual     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ ConditionalLayout│
└─────────┬───────┘
          │
          ▼
    ┌─────────┐
    │ /login? │───SIM──▶ Layout sem Sidebar
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │/cadastro│───SIM──▶ Layout sem Sidebar
    └────┬────┘
         │
         ▼
         NÃO
         │
         ▼
    Layout com Sidebar
```

### **🛡️ Proteção de Rotas**
```
┌─────────────────┐
│  Rota Protegida │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ ProtectedRoute  │
└─────────┬───────┘
          │
          ▼
    ┌─────────┐
    │Autenticado?│───NÃO──▶ Redireciona para /login
    └────┬────┘
         │
         ▼
         SIM
         │
         ▼
    Exibe Página
```

### **📱 Estrutura de Páginas**
```
┌─────────────────┐
│   Aplicação     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  ConditionalLayout│
└─────────┬───────┘
          │
          ▼
    ┌─────────┐
    │ /login  │───▶ Página Login (sem sidebar)
    └─────────┘
    ┌─────────┐
    │/cadastro│───▶ Página Cadastro (sem sidebar)
    └─────────┘
    ┌─────────┐
    │/dashboard│───▶ Dashboard (com sidebar)
    └─────────┘
    ┌─────────┐
    │/services│───▶ Serviços (com sidebar)
    └─────────┘
```

### **🔐 Estados de Autenticação**
```
┌─────────────────┐
│   Não Logado    │
└─────────┬───────┘
          │
          ▼
    ┌─────────┐
    │ Login   │───▶ Logado
    └─────────┘
          │
          ▼
    ┌─────────┐
    │ Logout  │───▶ Não Logado
    └─────────┘
```

### **📊 Componentes e Responsabilidades**
```
AuthContext
├── Gerenciar estado global
├── Persistir no localStorage
├── Funções de login/logout
└── Loading states

ConditionalLayout
├── Detectar rota atual
├── Ocultar sidebar em login/cadastro
└── Exibir sidebar em outras rotas

ProtectedRoute
├── Verificar autenticação
├── Redirecionar se não autenticado
└── Exibir loading durante verificação

Sidebar (sd.tsx)
├── Exibir nome do usuário
├── Menu de opções
└── Função de logout
```

---

## 📦 Dependências Instaladas

### **Dependências Atuais (já no package.json):**
```bash
# UI Components
@radix-ui/react-label@2.1.7
@radix-ui/react-select@2.2.6
lucide-react@0.542.0
class-variance-authority@0.7.1

# Autenticação (prontas para produção)
next-auth@4.24.11
bcryptjs@3.0.2
jsonwebtoken@9.0.2
@types/jsonwebtoken@9.0.10
```

### **Instalação Automática:**
```bash
# Todas as dependências são instaladas automaticamente com:
npm install
```

### **Nota Importante:**
- ✅ **@types/bcryptjs** não é necessário - o bcryptjs já inclui suporte nativo ao TypeScript
- ✅ **Todas as versões** estão fixadas no package.json para garantir compatibilidade
- ✅ **Instalação única** - basta executar `npm install` após clonar o repositório

---

## 📝 Comentários TODO no Código

Todos os arquivos contêm comentários `TODO` indicando onde futuramente:

- 🔄 Substituir dados hardcoded por APIs reais
- 🔐 Implementar autenticação robusta
- ✅ Adicionar validações do backend
- 🗄️ Integrar com banco de dados
- 🔑 Implementar permissões granulares

---

## ✅ Status da Implementação

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| 🎨 Sidebar Condicional | ✅ Completo | Ocultada em login/cadastro |
| 🔐 Autenticação Temporária | ✅ Completo | Usuário hardcoded funcional |
| 🛡️ Proteção de Rotas | ✅ Completo | Redirecionamento automático |
| 📱 Páginas Login/Cadastro | ✅ Completo | Formulários funcionais |
| 🎨 Sidebar com Logout | ✅ Completo | Menu de usuário funcional |
| 🔄 Redirecionamentos | ✅ Completo | Fluxo completo implementado |
| 💾 Persistência | ✅ Completo | localStorage funcional |
| ⏳ Loading States | ✅ Completo | Feedback visual |
| ❌ Tratamento de Erros | ✅ Completo | Mensagens de erro |
| 📚 Documentação | ✅ Completo | Documentação completa |

---




