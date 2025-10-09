import { render, screen, fireEvent } from '@testing-library/react';
import { RatingStars } from './RatingStars';

jest.mock('./RatingStars.module.scss', () => ({
  container: 'container',
  star: 'star',
  active: 'active',
}));

describe('RatingStars Component', () => {
  test('renders 5 stars', () => {
    render(<RatingStars />);
    const stars = screen.getAllByTestId('star');
    expect(stars.length).toBe(5);
  });

  test('clicking a star sets the rating', () => {
    render(<RatingStars />);
    const stars = screen.getAllByTestId('star');

    fireEvent.click(stars[2]); // Clicar na terceira estrela

    // Verificar se as três primeiras têm classe 'active'
    for (let i = 0; i < stars.length; i++) {
      if (i <= 2) {
        expect(stars[i].classList.contains('active')).toBe(true);
      } else {
        expect(stars[i].classList.contains('active')).toBe(false);
      }
    }
  });

  test('clicking the same star again resets the rating', () => {
    render(<RatingStars />);
    const stars = screen.getAllByTestId('star');

    fireEvent.click(stars[2]);
    fireEvent.click(stars[2]);

    stars.forEach((star) => {
      expect(star.classList.contains('active')).toBe(false);
    });
  });
});
