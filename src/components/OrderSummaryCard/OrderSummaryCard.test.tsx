import { render, screen } from '@testing-library/react';
import OrderSummaryCard from './OrderSummaryCard';
import type { OrderSummaryCardProps } from './OrderSummaryCard';

// Mock do botão
jest.mock('../Button', () => ({
  Button: ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

describe('OrderSummaryCard component', () => {
  const defaultProps: OrderSummaryCardProps = {
    orderCode: 'ORD123',
    clientName: 'João Silva',
    items: ['Item 1', 'Item 2', 'Item 3'],
    isNew: true,
  };

  it('renders order code and client name', () => {
    render(<OrderSummaryCard {...defaultProps} />);
    expect(screen.getByText('ORD123')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('renders list of items', () => {
    render(<OrderSummaryCard {...defaultProps} />);
    defaultProps.items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('shows "Novo" status when isNew is true', () => {
    render(<OrderSummaryCard {...defaultProps} />);
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('does not show "Novo" status when isNew is false', () => {
    render(<OrderSummaryCard {...defaultProps} isNew={false} />);
    expect(screen.queryByText('Novo')).not.toBeInTheDocument();
  });

  it('renders buttons with correct labels', () => {
    render(<OrderSummaryCard {...defaultProps} />);
    expect(screen.getByText('Mover Estágio')).toBeInTheDocument();
    expect(screen.getByText('Detalhes')).toBeInTheDocument();
  });
});
