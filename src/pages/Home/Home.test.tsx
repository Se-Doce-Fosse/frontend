import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renderiza título da Home', () => {
  render(<Home />);
  expect(screen.getByText('Página Inicial')).toBeInTheDocument();
});
