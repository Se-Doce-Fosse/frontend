# Frontend do projeto Se Doce Fosse

Guia para instalação e desenvolvimento do projeto


## Pré-requisitos

- Node.js 20+
- npm
- Git

## Instalação

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
4. Rode o servidor para desenvolvimento
```bash
npm run dev
```
5. Entre em http://localhost:5173

## Contribuindo para o projeto
### Após seguir os passos acima para instalação 👆🏽

Nomes de branchs, PRs e commmits em português. Para melhor entendimento, siga as normas da Wiki.
 
1. Crie uma branch para sua tarefa. Formato: (`git checkout -b tipo/numeroticket-descricao`) Exemplo: `feat/3422-componente-de-botao`
2. Commit suas mudanças. Formato: (`git commit -m 'tipo: descrição'`) Exemplo: `fix: altera cor do botão para melhor acessibilidade`
3. Push para a branch. Formato:(`git push origin tipo/numeroticket-descricao`)
4. Abra um Pull Request para a branch `develop`
5. Em caso de dúvidas, entre em contato com os AGES III.

##  Nomenclaturas dento do código
- **Tudo em inglês**
- **camelCase** para variáveis, funções e props
- **PascalCase** para nomes de componentes e arquivos `.tsx`

## Convenções de Código

### Estilização com SCSS

Este projeto utiliza **SCSS modules** com organização modularizada e padrões consistentes para facilitar manutenção e escalabilidade.

### Nomeação das Classes CSS

- Use **camelCase** para nomes de classes (ex: `className={styles.primaryButton}`, `className={styles.mainContainer}`).
- Escolha nomes semânticos que reflitam a função ou o papel do elemento, não sua aparência.

### Boas Práticas

- Componentes  reutilizáveis;
- Evitar o uso de `any`: usar tipagens com TypeScript;
- Comentários de código somente quando necessário. Evite muitos comentários
- Ao criar um Pull Request, descrever o que foi feito detalhadamente e adicionar screenshots (quando aplicável), bem como qualquer instrução para ver as mudanças.

### TypeScript

- Usar interfaces para props de componentes
- Exportar tipos junto com componentes

### Styling

- Variáveis para cores e tamanhos
- Mobile-first responsive design


### Testes

- Um arquivo de teste por componente
- Usar Testing Library para testes de componentes
- Cobertura mínima recomendada: 80%

## Scripts Disponíveis

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
- 📁 `src/`
  - 📁 `components/`       - Componentes reutilizáveis
    - 📁 `Button/`
      - `Button.tsx`
      - `Button.module.scss`
      - `Button.test.tsx`
      - `index.ts`         - Todo componente tem um index para exportação
    - `index.ts`           - Index geral da pasta components para facilitar imports 
  - 📁 `pages/`            - Páginas (rotas)
  - 📁 `hooks/`            - Custom hooks (useSomething)
  - 📁 `contexts/`         - React Context API
  - 📁 `services/`         - Comunicação com API
  - 📁 `types/`            - Tipagens globais
  - 📁 `utils/`            - Funções auxiliares e reutilizaveis entre vários componentes
  - 📁 `styles/`           - Estilos globais e variáveis reutilizáveis
```

## Exemplos de Componentes

### HelloWorld

Componente de demonstração com mensagem personalizável.

```tsx
import { HelloWorld } from '@/components';

<HelloWorld name="Mundo" showGreeting={true} />;
```

**Props:**

- `name`: string (padrão: 'World')
- `showGreeting`: boolean (padrão: true)
- `className`: string

## Git Hooks

O projeto está configurado com Husky para executar verificações automáticas:

### Pre-commit

- Executa `lint-staged` que formata e verifica o código

### Pre-push

- Executa testes unitários
- Verifica lint
- Gera build para garantir que não há erros

## CI/CD

O projeto inclui GitHub Actions configurado para:

- ✅ Executar em múltiplas versões do Node.js (18.x, 20.x)
- ✅ Instalar dependências
- ✅ Verificar lint/formatação
- ✅ Executar testes unitários com coverage
- ✅ Gerar build

O CI é executado em:

- **Pull Requests** para `main` e `develop`
- **Pushes** para **todas as branches**

## Configuração de Desenvolvimento Recomendada

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
