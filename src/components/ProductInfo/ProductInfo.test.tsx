import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductInfo from './ProductInfo';
import { DetailedProduct } from '../../types';
import { API_URL } from '../../api';


jest.mock('../../images/loading.svg', () => ({
  ReactComponent: () => <svg data-testid="loading-icon" />,
}));
jest.mock('../../images/empty.svg', () => ({
  ReactComponent: () => <svg data-testid="empty-icon" />,
}));
jest.mock('../../images/star-active.svg', () => ({
  ReactComponent: () => <svg data-testid="star-icon" />,
}));

jest.mock('../CartButton', () => () => <button>Добавить в корзину</button>);
jest.mock('../Reviews', () => () => <div>Отзывы</div>);

const product: DetailedProduct = {
  id: '1',
  name: 'Test Product',
  price: 1234,
  image: 'test-image.jpg',
  rating: 4.4,
  reviews_length: 10,
  description: 'Описание товара',
  category: 'цветы',
  reviews: [],
};

describe('ProductInfo', () => {
  it('отображает индикатор загрузки при loading=true', () => {
    render(<ProductInfo product={null} loading={true} />);
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument();
  });

  it('отображает сообщение о пустом товаре при product=null и loading=false', () => {
    render(<ProductInfo product={null} loading={false} />);
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
    expect(screen.getByText(/товар не найден/i)).toBeInTheDocument();
  });

  it('отображает информацию о товаре', () => {
    render(<ProductInfo product={product} loading={false} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(product.name);
    expect(screen.getByText('1 234 ₽')).toBeInTheDocument();
    expect(screen.getByAltText(product.name)).toHaveAttribute('src', `${API_URL}/${product.image}`);
    expect(screen.getByText(product.description)).toBeInTheDocument();

    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
    expect(screen.getByText(product.rating.toFixed(1))).toBeInTheDocument();

    expect(screen.getByText(/добавить в корзину/i)).toBeInTheDocument();

    expect(screen.getByText(/отзывы/i)).toBeInTheDocument();
  });

  it('отображает "нет отзывов", если рейтинг отсутствует', () => {
    const productNoRating = { ...product, rating: 0 };
    render(<ProductInfo product={productNoRating} loading={false} />);
    expect(screen.queryByTestId('star-icon')).not.toBeInTheDocument();
    expect(screen.getByText(/нет отзывов/i)).toBeInTheDocument();
  });
});
