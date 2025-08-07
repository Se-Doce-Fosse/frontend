import styles from './HelloWorld.module.scss';

export interface HelloWorldProps {
  name?: string;
  showGreeting?: boolean;
  className?: string;
}

export const HelloWorld = ({
  name = 'World',
  showGreeting = true,
  className = '',
}: HelloWorldProps) => {
  const message = showGreeting ? `Hello, ${name}!` : `Goodbye, ${name}!`;

  return (
    <div
      className={`${styles.helloWorld} ${className}`}
      data-testid="hello-world"
    >
      <h1 className={styles.helloWorldTitle}>{message}</h1>
      <p className={styles.helloWorldSubtitle}>
        Welcome to our React + TypeScript + Vite project!
      </p>
    </div>
  );
};
