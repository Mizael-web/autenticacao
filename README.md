# Sistema de Autenticação de Alunos

Este é um sistema completo de autenticação e gerenciamento de alunos desenvolvido em Node.js com Express, utilizando PostgreSQL como banco de dados e JWT para autenticação.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Configuração](#configuração)
- [Instalação](#instalação)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Sistema de Autenticação](#sistema-de-autenticação)
- [Modelos de Dados](#modelos-de-dados)
- [Middleware de Autenticação](#middleware-de-autenticação)

## 🎯 Visão Geral

Este sistema fornece uma API RESTful completa para:
- Cadastro de alunos com validação de dados
- Sistema de login/logout seguro
- Autenticação baseada em JWT com Access Token e Refresh Token
- Proteção de rotas sensíveis
- Gerenciamento de perfil de usuário

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura modular baseada em MVC (Model-View-Controller) com as seguintes características:

- **Modular**: Cada funcionalidade é organizada em módulos independentes
- **RESTful**: API seguindo padrões REST
- **Segura**: Implementação de autenticação JWT com duplo token
- **Escalável**: Estrutura que permite fácil expansão

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Ambiente de execução JavaScript
- **Express.js**: Framework web minimalista e flexível
- **Sequelize**: ORM para PostgreSQL
- **PostgreSQL**: Banco de dados relacional

### Autenticação e Segurança
- **jsonwebtoken**: Geração e verificação de tokens JWT
- **bcryptjs**: Hash de senhas
- **cors**: Configuração de CORS para frontend

### Utilitários
- **dotenv**: Gerenciamento de variáveis de ambiente

## 📁 Estrutura de Pastas

```
autenticacao/
├── index.js                          # Arquivo principal do servidor
├── package.json                      # Dependências e scripts
├── .env                             # Variáveis de ambiente (não versionado)
├── .env.example                     # Exemplo de variáveis de ambiente
├── .gitignore                       # Arquivos ignorados pelo Git
└── src/
    ├── config/
    │   └── configDB.js              # Configuração do banco de dados
    └── modulos/
        ├── aluno/                   # Módulo de gerenciamento de alunos
        │   ├── controllers/
        │   │   └── aluno.controller.js
        │   ├── middleware/
        │   │   └── aluno.autenticacao.js
        │   ├── models/
        │   │   └── aluno.model.js
        │   └── routes/
        │       └── aluno.route.js
        └── autenticacao/            # Módulo de autenticação
            ├── controller/
            │   └── autenticacao.controller.js
            └── routes/
                └── autenticacao.route.js
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
# Configurações do Banco de Dados
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=nome_banco
DB_PASSWORD=senha_do_banco
DB_PORT=5432

# Configurações do Servidor
PORTA=3001
NODE_ENV=development

# Configurações JWT
TEMPO_ACESS_TOKEN="2m"              # Tempo de vida do access token
TEMPO_REFRESH_TOKEN="24h"           # Tempo de vida do refresh token
SECRET_KEY=sua_chave_secreta_aqui
JWT_REFRESH_SECRET=sua_chave_refresh_aqui
```

## 🚀 Instalação

1. **Clone o repositório**:
```bash
git clone <url-do-repositorio>
cd autenticacao
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure o banco de dados PostgreSQL**:
   - Crie um banco de dados PostgreSQL
   - Configure as variáveis de ambiente no arquivo `.env`

4. **Execute o servidor**:
```bash
node index.js
```

O servidor estará rodando em `http://localhost:3001`

## 📝 Uso

### Fluxo de Uso do Sistema

1. **Cadastro**: O aluno se cadastra fornecendo nome, matrícula, email e senha
2. **Login**: O aluno faz login com matrícula e senha
3. **Acesso a rotas protegidas**: Utiliza o access token para acessar recursos protegidos
4. **Renovação de token**: Utiliza o refresh token para obter novos access tokens
5. **Logout**: Remove o refresh token dos cookies

## 🔌 API Endpoints

### Rotas Públicas

#### Cadastro de Aluno
```http
POST /api/cadastrar
Content-Type: application/json

{
  "nome": "João Silva",
  "matricula": "A12345678",
  "email": "joao@email.com",
  "senha": "MinhaSenh@123"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "matricula": "A12345678",
  "senha": "MinhaSenh@123"
}
```

**Resposta de sucesso:**
```json
{
  "msg": "Usuario logado com sucesso",
  "tokenAcesso": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "nome": "João Silva",
  "papel": "aluno"
}
```

#### Logout
```http
POST /api/logout
```

#### Renovar Token
```http
POST /api/refress-token
```

### Rotas Protegidas

#### Perfil do Aluno
```http
GET /api/perfil
Authorization: Bearer <access_token>
```

**Resposta:**
```json
{
  "perfil": {
    "nome": "João Silva",
    "matricula": "A12345678",
    "email": "joao@email.com"
  }
}
```

## 🔐 Sistema de Autenticação

### Arquitetura de Autenticação

O sistema implementa uma autenticação baseada em **duplo token JWT**:

#### Access Token
- **Propósito**: Autenticar requisições à API
- **Duração**: 2 minutos (configurável)
- **Armazenamento**: Memória do frontend/localStorage
- **Uso**: Enviado no header `Authorization: Bearer <token>`

#### Refresh Token
- **Propósito**: Renovar access tokens expirados
- **Duração**: 24 horas (configurável)
- **Armazenamento**: Cookie HTTP-only
- **Segurança**: Maior tempo de vida, armazenado de forma segura

### Fluxo de Autenticação

1. **Login**: 
   - Usuário envia credenciais
   - Sistema valida e gera ambos os tokens
   - Access token é retornado na resposta
   - Refresh token é definido como cookie seguro

2. **Acesso a recursos protegidos**:
   - Cliente envia access token no header
   - Middleware valida o token
   - Se válido, permite acesso ao recurso

3. **Renovação de token**:
   - Quando access token expira
   - Cliente usa refresh token para obter novo access token
   - Sistema valida refresh token e gera novo access token

4. **Logout**:
   - Remove refresh token dos cookies
   - Cliente descarta access token

### Vantagens desta Abordagem

- **Segurança**: Tokens de curta duração reduzem janela de exposição
- **Usabilidade**: Refresh token permite renovação automática
- **Flexibilidade**: Diferentes tempos de vida para diferentes propósitos

## 📊 Modelos de Dados

### Modelo Aluno

**Arquivo**: `src/modulos/aluno/models/aluno.model.js`

```javascript
{
  nome: String (obrigatório),
  matricula: String (chave primária, formato: letra + 8 dígitos),
  email: String (obrigatório, único, formato email),
  senha: String (obrigatório, hash bcrypt),
  criado_em: DateTime (automático),
  atualizado_em: DateTime (automático)
}
```

#### Validações do Modelo

- **Matrícula**: Deve seguir o padrão de uma letra seguida de 8 números (ex: A12345678)
- **Email**: Validação de formato de email
- **Senha**: Deve conter pelo menos 8 caracteres, incluindo:
  - Uma letra maiúscula
  - Uma letra minúscula
  - Um número
  - Um caractere especial

## 🛡️ Middleware de Autenticação

### AutenticacaoMiddleware

**Arquivo**: `src/modulos/aluno/middleware/aluno.autenticacao.js`

Este middleware é responsável por:

1. **Extrair o token**: Busca o token no header `Authorization`
2. **Validar formato**: Verifica se está no formato "Bearer TOKEN"
3. **Verificar token**: Usa JWT para validar assinatura e expiração
4. **Adicionar usuário**: Adiciona dados do usuário à requisição (`req.usuario`)
5. **Controle de acesso**: Permite ou nega acesso baseado na validação

```javascript
// Exemplo de uso do middleware
router.get('/perfil', AutenticacaoMiddleware.autenticarToken, AlunoController.perfil);
```

## 📁 Detalhamento dos Arquivos

### `index.js` - Servidor Principal

**Responsabilidades**:
- Configuração do servidor Express
- Configuração de CORS para permitir frontend React
- Conexão com banco de dados
- Sincronização de modelos
- Definição de rotas principais

**Configurações importantes**:
- CORS configurado para `http://localhost:5173` (frontend React)
- Middleware para parsing JSON
- Sincronização forçada do banco (`force: true, alter: true`)

### `src/config/configDB.js` - Configuração do Banco

**Função**: Estabelece conexão com PostgreSQL usando Sequelize
- Usa variáveis de ambiente para configuração
- Logging desabilitado para produção
- Dialect PostgreSQL

### Módulo Aluno

#### `aluno.model.js` - Modelo de Dados
- Define estrutura da tabela `aluno`
- Implementa validações de dados
- Configurações de timestamp customizadas

#### `aluno.controller.js` - Controlador de Alunos
**Métodos**:
- `cadastrar`: Registra novo aluno com hash da senha
- `perfil`: Retorna dados do perfil (rota protegida)

#### `aluno.route.js` - Rotas de Aluno
- Rota pública: `/cadastrar`
- Rota protegida: `/perfil` (requer autenticação)

#### `aluno.autenticacao.js` - Middleware de Autenticação
- Verifica tokens JWT
- Adiciona dados do usuário à requisição
- Controla acesso a rotas protegidas

### Módulo Autenticação

#### `autenticacao.controller.js` - Controlador de Autenticação
**Métodos**:
- `gerarTokenAcesso`: Cria access tokens JWT
- `gerarRefressToken`: Cria refresh tokens JWT
- `login`: Autentica usuário e gera tokens
- `refreshToken`: Renova access token usando refresh token
- `sair`: Remove refresh token (logout)

#### `autenticacao.route.js` - Rotas de Autenticação
- `/login`: Autenticação de usuário
- `/logout`: Encerramento de sessão
- `/refress-token`: Renovação de token

## 🔧 Configurações de Segurança

### Hash de Senhas
- Algoritmo: bcrypt
- Salt rounds: 15 (alta segurança)

### Configuração de Cookies
- `httpOnly`: Proteção contra XSS
- `secure`: HTTPS em produção
- `sameSite`: Proteção CSRF

### CORS
- Origem específica configurada
- Credentials habilitados para cookies

## 🐛 Tratamento de Erros

O sistema implementa tratamento robusto de erros:

- **400**: Dados inválidos ou faltantes
- **401**: Não autorizado (token ausente)
- **403**: Proibido (token inválido)
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

Todas as respostas de erro incluem mensagens descritivas para facilitar debugging.

## 🚀 Melhorias Futuras

1. **Validação avançada**: Implementar validação mais robusta no frontend
2. **Rate limiting**: Adicionar limitação de tentativas de login
3. **Logging**: Sistema de logs para auditoria
4. **Testes**: Implementar testes unitários e de integração
5. **Docker**: Containerização da aplicação
6. **Documentação API**: Swagger/OpenAPI
7. **Cache**: Implementar cache Redis para tokens
8. **Notificações**: Sistema de notificações por email

## 📞 Suporte

Para dúvidas ou sugestões sobre este projeto, entre em contato através dos canais apropriados.

---

**Desenvolvido com ❤️ usando Node.js e Express**
