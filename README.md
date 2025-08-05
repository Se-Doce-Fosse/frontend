# React + TypeScript + Vite Project

Estrutura do projeto com React + TypeScript, configurado com Vite e ferramentas auxiliares de desenvolvimento.

## 🚀 Recursos

- ⚛️ **React 19** com TypeScript a partir do Vite
- 🎨 **Sass/SCSS** para estilização
- 🧪 **Jest** + **Testing Library** para testes unitários
- 📏 **ESLint** + **Prettier** para qualidade de código
- 🐺 **Husky** para git hooks
- 🔄 **GitHub Actions** para CI/CD
- 📦 **lint-staged** para formatação automática

## 📋 Pré-requisitos

- Node.js 20+
- npm
- Git

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Se-Doce-Fosse/frontend.git
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure os git hooks:

```bash
npm run prepare
```

## 🤝 Contribuindo

1. Após seguir os passos acima para instalação 👆🏽
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor de desenvolvimento

# Build
npm run build           # Gera build de produção

# Testes
npm run test            # Executa testes
npm run test:watch      # Executa testes em modo watch
npm run test:coverage   # Executa testes com coverage

# Code Quality
npm run lint            # Verifica problemas de lint
npm run lint:fix        # Corrige problemas de lint automaticamente
npm run format          # Formata código com Prettier
npm run format:check    # Verifica formatação
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Button/
│   │   ├── Button.tsx   # Componente Button
│   │   ├── Button.scss  # Estilos do Button
│   │   ├── Button.test.tsx # Testes do Button
│   │   └── index.ts     # Export do Button
│   ├── HelloWorld/
│   │   ├── HelloWorld.tsx
│   │   ├── HelloWorld.scss
│   │   ├── HelloWorld.test.tsx
│   │   └── index.ts
│   └── index.ts         # Export de todos os componentes
├── App.tsx              # Componente principal
├── App.css              # Estilos globais
├── main.tsx             # Entry point
└── setupTests.ts        # Configuração dos testes
```

## 🧪 Exemplos de Componentes

### Button

Componente de botão reutilizável com múltiplas variantes e tamanhos.

```tsx
import { Button } from './components';

<Button variant="primary" size="medium" onClick={handleClick}>
  Clique aqui
</Button>;
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'danger'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `onClick`: função de callback
- `type`: 'button' | 'submit' | 'reset'

### HelloWorld

Componente de demonstração com mensagem personalizável.

```tsx
import { HelloWorld } from './components';

<HelloWorld name="Mundo" showGreeting={true} />;
```

**Props:**

- `name`: string (padrão: 'World')
- `showGreeting`: boolean (padrão: true)
- `className`: string

## 🔧 Git Hooks

O projeto está configurado com Husky para executar verificações automáticas:

### Pre-commit

- Executa `lint-staged` que formata e verifica o código

### Pre-push

- Executa testes unitários
- Verifica lint
- Gera build para garantir que não há erros

## 🚀 CI/CD

O projeto inclui GitHub Actions configurado para:

- ✅ Executar em múltiplas versões do Node.js (18.x, 20.x)
- ✅ Instalar dependências
- ✅ Verificar lint/formatação
- ✅ Executar testes unitários com coverage
- ✅ Gerar build

O CI é executado em:

- **Pull Requests** para `main` e `master`
- **Pushes** para **todas as branches**

## 📝 Convenções de Código

### TypeScript

- Usar interfaces para props de componentes
- Exportar tipos junto com componentes

### Styling

- Variáveis para cores e espaçamentos
- Mobile-first responsive design

### Testes

- Um arquivo de teste por componente
- Usar Testing Library para testes de componentes
- Cobertura mínima recomendada: 80%

## 🛠️ Configuração de Desenvolvimento Recomendada

### Extensões para VSCode Recomendadas

- ESLint
- Prettier
- TypeScript Hero
- SCSS IntelliSense
- Jest

### Settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
