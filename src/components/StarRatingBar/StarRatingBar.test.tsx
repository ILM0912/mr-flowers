import { render, screen, fireEvent } from '@testing-library/react';
import StarRatingBar from './StarRatingBar';

jest.mock('../../images/star-active.svg', () => ({
  ReactComponent: () => <svg data-testid='star-active' />
}));
jest.mock('../../images/star.svg', () => ({
  ReactComponent: () => <svg data-testid='star' />
}));

describe('StarRatingBar', () => {
  it('рендерит 5 иконок и нужное количество активных звёзд', () => {
    render(<StarRatingBar rating={3} />);
    
    expect(screen.getAllByTestId('star-active')).toHaveLength(3);
    expect(screen.getAllByTestId('star')).toHaveLength(2);
  });

  it('вызывает onChange при клике в editable режиме', () => {
    const onChange = jest.fn();
    const { container } = render(<StarRatingBar rating={2} editable onChange={onChange} />);

    const stars = container.querySelectorAll('span');
    fireEvent.click(stars[3]);

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('не вызывает onChange в неактивном режиме', () => {
    const onChange = jest.fn();
    const { container } = render(<StarRatingBar rating={2} onChange={onChange} />);

    const stars = container.querySelectorAll('span');
    fireEvent.click(stars[3]);

    expect(onChange).not.toHaveBeenCalled();
  });
});
