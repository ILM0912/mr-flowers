import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Reviews from './Reviews';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { DetailedProduct, Review } from '../../types';

jest.mock('../../images/star-active.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../images/star.svg', () => ({
  ReactComponent: () => <svg />,
}));

const mockStore = configureStore([]);

const productWithReviews: DetailedProduct = {
    id: 'p1',
    name: 'Test Product',
    reviews: [
        { id: 'r1', author: 'User1', stars: 5, text: 'Great!', date: '2023-01-01', email: 'u1@example.com' },
        { id: 'r2', author: 'User2', stars: 4, text: 'Good', date: '2023-02-01', email: 'u2@example.com' },
    ],
    description: '',
    price: 0,
    category: '',
    image: '',
    rating: 4.5,
    reviews_length: 2
};

const productNoReviews: DetailedProduct = {
    id: 'p2',
    name: 'No Reviews Product',
    reviews: [],
    description: '',
    price: 0,
    category: '',
    image: '',
    rating: 0,
    reviews_length: 0
};

describe('Reviews', () => {
  it('показывает сообщение о необходимости авторизации, если пользователь не аутентифицирован', () => {
    const store = mockStore({ auth: { user: null, isAuthenticated: false } });

    render(
      <Provider store={store}>
        <Reviews product={productWithReviews} />
      </Provider>
    );

    expect(screen.getByText(/Чтобы оставить отзыв, войдите в аккаунт/i)).toBeInTheDocument();
  });

  it('показывает сообщение, если пользователь не покупал товар', () => {
    const store = mockStore({
      auth: { 
        user: { email: 'test@example.com', orders: [] }, 
        isAuthenticated: true 
      }
    });

    render(
      <Provider store={store}>
        <Reviews product={productWithReviews} />
      </Provider>
    );

    expect(screen.getByText(/Оставлять отзывы могут только покупатели этого товара/i)).toBeInTheDocument();
  });

  it('показывает сообщение, если пользователь уже оставил отзыв', () => {
    const store = mockStore({
      auth: { 
        user: { email: 'u1@example.com', orders: [{ items: [{ product: { id: 'p1' } }] }] }, 
        isAuthenticated: true 
      }
    });

    render(
      <Provider store={store}>
        <Reviews product={productWithReviews} />
      </Provider>
    );

    expect(screen.getByText(/Вы уже оставили отзыв на этот товар/i)).toBeInTheDocument();
  });

  it('показывает форму отзыва, если пользователь аутентифицирован, покупал товар и не оставлял отзыв', () => {
    const store = mockStore({
      auth: { 
        user: { email: 'newuser@example.com', orders: [{ items: [{ product: { id: 'p1' } }] }] }, 
        isAuthenticated: true 
      }
    });

    render(
      <Provider store={store}>
        <Reviews product={productWithReviews} />
      </Provider>
    );

    fireEvent.click(screen.getByText("Оставить отзыв"));

    expect(screen.getByText(/Оставьте отзыв:/i)).toBeInTheDocument();
  });

  it('корректно отображает список отзывов', () => {
    const store = mockStore({
      auth: { user: null, isAuthenticated: false }
    });

    render(
      <Provider store={store}>
        <Reviews product={productWithReviews} />
      </Provider>
    );

    expect(screen.getByText('User1')).toBeInTheDocument();
    expect(screen.getByText('Great!')).toBeInTheDocument();
    expect(screen.getByText('User2')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('показывает сообщение, если отзывов нет', () => {
    const store = mockStore({
      auth: { user: null, isAuthenticated: false }
    });

    render(
      <Provider store={store}>
        <Reviews product={productNoReviews} />
      </Provider>
    );

    expect(screen.getByText(/Отзывов пока нет/i)).toBeInTheDocument();
  });
});
