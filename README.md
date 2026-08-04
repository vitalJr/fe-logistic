# Logistic

Sistema de gestão logística — catálogo de produtos e categorias, fornecedores,
clientes, cadastro e autenticação de usuários. Aplicação **Next.js (App
Router)** em **TypeScript**, com validação via **Zod** e Server Actions para
todas as mutações.

Consulte [AGENTS.md](./AGENTS.md) para as convenções de código e estrutura de
pastas do projeto.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, React 19, React Compiler)
- TypeScript em modo `strict`
- [Zod](https://zod.dev) para validação de formulários, Server Actions e env vars
- CSS Modules

## Pré-requisitos

- Node.js 20+
- A API do backend (`be-logistic`) rodando e acessível

## Configuração

Crie um arquivo `.env.local` na raiz do projeto com a URL da API:

```bash
API_URL=http://localhost:3002/api/v1
```

Instale as dependências:

```bash
npm install
```

## Rodando localmente

```bash
npm run dev
```

A aplicação sobe em [http://localhost:3001](http://localhost:3001).

## Scripts

| Comando         | Descrição                              |
| --------------- | --------------------------------------- |
| `npm run dev`   | Sobe o servidor de desenvolvimento       |
| `npm run build` | Gera o build de produção                |
| `npm run start` | Sobe o servidor a partir do build        |
| `npm run lint`  | Roda o ESLint                            |

## Funcionalidades

- **Autenticação** — login, pré-cadastro e sessão via cookie `httpOnly`
- **Perfil do usuário** — conclusão de cadastro (documento, cargo, empresa) com
  indicação visual dos campos pendentes
- **Categorias** — CRUD completo
- **Produtos** — CRUD completo, com categoria, unidade, estoque mínimo e preço
- **Fornecedores** — CRUD, busca por nome/NIF, bloqueio de NIF duplicado e
  ativar/desativar direto na lista (desativar exige confirmação)
- **Clientes** — mesmas funcionalidades de fornecedores
- **Showroom** (`/showroom`) — catálogo dos componentes reutilizáveis de UI
