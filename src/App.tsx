import { HelloWorld } from '@components';

function App() {
  return (
    <div className="app">
      <div className="appHeader">
        <img
          src="/vite.svg"
          className="appLogo"
          alt="Vite logo"
          width="60"
          height="60"
        />
        <h1 className="appTitle">React + TypeScript + Vite</h1>
      </div>

      <main className="appMain">
        <HelloWorld className="appHelloWorld" />
        <div className="appInfo">
          <p>This project includes:</p>
          <ul>
            <li>✅ React 19 with TypeScript</li>
            <li>✅ Vite for fast development</li>
            <li>✅ Sass/SCSS for styling</li>
            <li>✅ Jest for unit testing</li>
            <li>✅ ESLint & Prettier for code quality</li>
            <li>✅ Husky for git hooks</li>
            <li>✅ GitHub Actions for CI/CD</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
