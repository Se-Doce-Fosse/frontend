import * as React from 'react';
import './HelloWorld.scss';

export interface HelloWorldProps {
  name?: string;
  showGreeting?: boolean;
  className?: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({
  name = 'World',
  showGreeting = true,
  className = '',
}) => {
  const message = showGreeting ? `Hello, ${name}!` : `Goodbye, ${name}!`;

  return (
    <div className={`hello-world ${className}`} data-testid="hello-world">
      <h1 className="hello-world__title">{message}</h1>
      <p className="hello-world__subtitle">
        Welcome to our React + TypeScript + Vite project!
      </p>
    </div>
  );
};
