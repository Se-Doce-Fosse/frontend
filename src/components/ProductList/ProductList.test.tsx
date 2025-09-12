// import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductList } from './ProductList';
import type { Product } from './ProductList';
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// import '@testing-library/jest-dom';

describe('ProductList', () => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Cookie Oreo com Nutella',
      price: 'R$ 15,00',
      imageSrc: '/images/cookie-oreo.jpg',
      imageAlt: 'Cookie Oreo com Nutella',
    },
    {
      id: '2',
      name: 'Cookie Chocolate Branco',
      price: 'R$ 15,00',
      imageSrc: '/images/cookie-branco.jpg',
      imageAlt: 'Cookie Chocolate Branco',
    },
  ];

  it('renders the title and products', () => {
  render(<ProductList title="Doces" products={products} />);
  expect(screen.getByText('Doces')).toBeInTheDocument();
    expect(screen.getByText('Cookie Oreo com Nutella')).toBeInTheDocument();
    expect(screen.getByText('Cookie Chocolate Branco')).toBeInTheDocument();
  });

  it('renders the ShowMoreButton when showMore is true', () => {
  render(<ProductList title="Doces" products={products} showMore />);
  expect(screen.getByRole('button', { name: /ver mais/i })).toBeInTheDocument();
  });

  it('does not render the ShowMoreButton when showMore is false', () => {
  render(<ProductList title="Doces" products={products} showMore={false} />);
    expect(screen.queryByRole('button', { name: /ver mais/i })).not.toBeInTheDocument();
  });
});
