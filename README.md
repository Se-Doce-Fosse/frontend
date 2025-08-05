# React + TypeScript + Vite Project

Um projeto moderno de React com TypeScript, configurado com Vite e ferramentas de desenvolvimento completas.

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
- npm ou yarn
- Git

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
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
- Usar strict mode

### Styling

- Usar SCSS com metodologia BEM
- Variáveis para cores e espaçamentos
- Mobile-first responsive design

### Testes

- Um arquivo de teste por componente
- Usar Testing Library para testes de componentes
- Cobertura mínima recomendada: 80%

### Git

- Commits descritivos em português
- Usar conventional commits quando possível
- Branches descritivas

## 🛠️ Configuração de Desenvolvimento

### VSCode Extensions Recomendadas

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

## 🚀 Deploy

Para fazer deploy em produção:

1. Execute o build:

```bash
npm run build
```

2. Os arquivos gerados estarão em `dist/`

3. Faça upload para seu servidor ou serviço de hosting

### Opções de Deploy

- **Vercel**: Conecte seu repositório GitHub
- **Netlify**: Drag & drop da pasta `dist/`
- **GitHub Pages**: Configure GitHub Actions
- **AWS S3 + CloudFront**: Para maior controle

## 📚 Próximos Passos

- [ ] Adicionar mais componentes (Input, Modal, etc.)
- [ ] Implementar roteamento com React Router
- [ ] Adicionar gerenciamento de estado (Context API ou Zustand)
- [ ] Configurar Storybook para documentação de componentes
- [ ] Adicionar testes E2E com Playwright
- [ ] Implementar PWA features

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Problemas Comuns

### Node.js Version Warnings

Este projeto foi criado com versões modernas das ferramentas. Para melhor compatibilidade, use Node.js 20+.

### Husky não funciona

Se os git hooks não estiverem funcionando, execute:

```bash
npx husky install
```

### Testes falhando

Verifique se todas as dependências estão instaladas:

```bash
npm ci
```

## 📞 Suporte

Se você encontrar problemas ou tiver dúvidas:

1. Verifique a documentação
2. Procure em issues existentes
3. Crie uma nova issue detalhando o problema
