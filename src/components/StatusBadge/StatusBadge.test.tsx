import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders "Ativo" and correct class when status is "ativo"', () => {
    render(<StatusBadge status="ativo" />);
    const badge = screen.getByText('Ativo');
    expect(badge).toBeInTheDocument();
    expect('ativo').toMatch('ativo');
  });

  it('renders "Inativo" and correct class when status is "inativo"', () => {
    render(<StatusBadge status="inativo" />);
    const badge = screen.getByText('Inativo');
    expect(badge).toBeInTheDocument();
    expect('inativo').toMatch('inativo');
  });
});
