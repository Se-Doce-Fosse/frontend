import { useState } from 'react';
import { HelloWorld, Button } from './components';
import './App.css';

function App() {
  const [showGreeting, setShowGreeting] = useState(true);
  const [name, setName] = useState('World');

  const toggleGreeting = () => {
    setShowGreeting(!showGreeting);
  };

  const changeName = () => {
    const names = ['World', 'React', 'TypeScript', 'Vite', 'Developer'];
    const currentIndex = names.indexOf(name);
    const nextIndex = (currentIndex + 1) % names.length;
    setName(names[nextIndex]);
  };

  return (
    <div className="app">
      <div className="app__header">
        <img
          src="/vite.svg"
          className="app__logo"
          alt="Vite logo"
          width="60"
          height="60"
        />
        <h1 className="app__title">React + TypeScript + Vite</h1>
      </div>

      <main className="app__main">
        <HelloWorld
          name={name}
          showGreeting={showGreeting}
          className="app__hello-world"
        />

        <div className="app__controls">
          <Button onClick={toggleGreeting} variant="primary">
            {showGreeting ? 'Say Goodbye' : 'Say Hello'}
          </Button>

          <Button onClick={changeName} variant="secondary">
            Change Name
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="danger"
            size="small"
          >
            Reset
          </Button>
        </div>

        <div className="app__info">
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
