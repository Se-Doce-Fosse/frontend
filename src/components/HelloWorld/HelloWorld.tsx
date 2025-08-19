import { Chart } from 'react-google-charts';
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

  const data = [
    ['Task', 'Hours per Day'],
    ['Work', 9],
    ['Eat', 2],
    ['Commute', 2],
    ['Watch TV', 2],
    ['Sleep', 7],
  ];

  const options = {
    title: 'My Daily Activities',
  };

  return (
    <div
      className={`${styles.helloWorld} ${className}`}
      data-testid="hello-world"
    >
      <h1 className={styles.helloWorldTitle}>{message}</h1>
      <p className={styles.helloWorldSubtitle}>
        Welcome to our React + TypeScript + Vite project!
      </p>

      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={'100%'}
        height={'400px'}
      />
    </div>
  );
};
