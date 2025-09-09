# 🚀 Guia de Instalação - Reserveja

## 📋 Pré-requisitos

- **Node.js** 18.20.0 ou superior
- **npm** 9.0.0 ou superior
- **Git** para clonar o repositório

## 🔧 Instalação Passo a Passo

### **1. Clonar o Repositório**
```bash
git clone <url-do-repositorio>
cd reserveja
```

### **2. Instalar Dependências**
```bash
# Instalar todas as dependências automaticamente
npm install
```

### **3. Executar o Projeto**
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

### **4. Acessar a Aplicação**
- **Desenvolvimento:** http://localhost:3000
- **Produção:** http://localhost:3000

## 📦 Dependências Incluídas

### **UI Components**
- `@radix-ui/react-label@2.1.7` - Componente Label
- `@radix-ui/react-select@2.2.6` - Componente Select
- `lucide-react@0.542.0` - Ícones
- `class-variance-authority@0.7.1` - Variantes de classes

### **Autenticação (Prontas para Produção)**
- `next-auth@4.24.11` - Autenticação Next.js
- `bcryptjs@3.0.2` - Hash de senhas
- `jsonwebtoken@9.0.2` - Tokens JWT
- `@types/jsonwebtoken@9.0.10` - Tipos TypeScript

### **Framework e Core**
- `next@15.5.2` - Framework Next.js
- `react@19.1.0` - Biblioteca React
- `react-dom@19.1.0` - DOM React
- `typescript@^5` - TypeScript

### **Styling**
- `tailwindcss@^4` - Framework CSS
- `clsx@^2.1.1` - Utilitário de classes
- `tailwind-merge@^3.3.1` - Merge de classes Tailwind

## 🧪 Testando a Instalação

### **1. Verificar se o Servidor Iniciou**
```bash
npm run dev
# Deve mostrar: "Ready - started server on 0.0.0.0:3000"
```

### **2. Testar Autenticação**
- Acesse: http://localhost:3000/login
- Use as credenciais: `admin@exemplo.com` / `123456`
- Deve redirecionar para o dashboard

### **3. Verificar Funcionalidades**
- ✅ Sidebar oculta em login/cadastro
- ✅ Sidebar visível no dashboard
- ✅ Proteção de rotas funcionando
- ✅ Logout funcionando

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter

# Instalação
npm install          # Instala todas as dependências
npm ci               # Instalação limpa (CI/CD)
```

## 🐛 Solução de Problemas

### **Erro: "Module not found"**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **Erro: "Port 3000 already in use"**
```bash
# Usar porta diferente
npm run dev -- -p 3001
```

### **Erro de Hidratação**
- O projeto já inclui correções para erros de hidratação
- Se persistir, verifique se está usando Node.js 18.20.0+

## 📚 Documentação Adicional

- **[AUTH_SYSTEM.md](./AUTH_SYSTEM.md)** - Documentação completa do sistema de autenticação
- **[README.md](./README.md)** - Visão geral do projeto

## ✅ Verificação Final

Após a instalação, você deve ter:

- ✅ Servidor rodando em http://localhost:3000
- ✅ Página de login funcionando
- ✅ Sistema de autenticação ativo
- ✅ Sidebar condicional funcionando
- ✅ Proteção de rotas ativa

**Projeto pronto para desenvolvimento!** 🎉
