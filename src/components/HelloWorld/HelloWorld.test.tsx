import { render, screen } from '@testing-library/react';
import { HelloWorld } from './HelloWorld';
import styles from './HelloWorld.module.scss';

describe('HelloWorld Component', () => {
  it('renders with default props', () => {
    render(<HelloWorld />);

    expect(screen.getByTestId('hello-world')).toBeInTheDocument();
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    expect(
      screen.getByText('Welcome to our React + TypeScript + Vite project!')
    ).toBeInTheDocument();
  });

  it('renders with custom name', () => {
    const customName = 'João';
    render(<HelloWorld name={customName} />);

    expect(screen.getByText(`Hello, ${customName}!`)).toBeInTheDocument();
  });

  it('shows goodbye message when showGreeting is false', () => {
    const customName = 'Maria';
    render(<HelloWorld name={customName} showGreeting={false} />);

    expect(screen.getByText(`Goodbye, ${customName}!`)).toBeInTheDocument();
    expect(screen.queryByText(`Hello, ${customName}!`)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<HelloWorld className={customClass} />);

    const element = screen.getByTestId('hello-world');
    expect(element).toHaveClass(styles.helloWorld);
    expect(element).toHaveClass(customClass);
  });

  it('has proper structure with title and subtitle', () => {
    render(<HelloWorld />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass(styles.helloWorldTitle);

    const subtitle = screen.getByText(
      'Welcome to our React + TypeScript + Vite project!'
    );
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass(styles.helloWorldSubtitle);
  });

  it('handles empty name gracefully', () => {
    render(<HelloWorld name="" />);

    expect(screen.getByText('Hello, !')).toBeInTheDocument();
  });
});
