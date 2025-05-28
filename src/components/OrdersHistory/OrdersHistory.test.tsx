import React from 'react';
import { render, screen } from '@testing-library/react';
import OrdersHistory from './OrdersHistory';
import { BrowserRouter } from 'react-router-dom';
import { Order, Product } from '../../types';

jest.mock('../../utils', () => ({
  formatDateTime: (date: string) => date,
  formatPrice: (price: number) => price,
  formatDate: (date: number) => date
}));

const product1: Product = {
    id: '1',
    name: 'Flower 1',
    price: 1000,
    image: 'flower1.jpg',
    rating: 0.0,
    reviews_length: 0,
    category: 'цветы'
};

const product2: Product = {
    id: '2',
    name: 'Flower 2',
    price: 800,
    image: 'flower2.jpg',
    rating: 0.0,
    reviews_length: 0,
    category: 'цветы'
}

const dummyItems = [
  { product: product1, quantity: 2 },
  { product: product2, quantity: 1 },
];

describe('OrdersHistory', () => {
  it('отображает сообщение при отсутствии заказов', () => {
    render(
      <BrowserRouter>
        <OrdersHistory orders={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText('История заказов')).toBeInTheDocument();
    expect(screen.getByText('У вас пока нет заказов.')).toBeInTheDocument();
  });

  it('отображает список заказов', () => {
    const mockOrders: Order[] = [
      {
        createdAt: '2024-01-01T12:00:00Z',
        total: 2800,
        finalTotal: 1800,
        id: 0,
        items: dummyItems,
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: '',
        phone: '',
        bonusesToUse: 0,
        email: ''
      },
    ];

    render(
      <BrowserRouter>
        <OrdersHistory orders={mockOrders} />
      </BrowserRouter>
    );

    expect(screen.getByText('История заказов')).toBeInTheDocument();
    expect(screen.getByText('Создан: 2024-01-01T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText(/2800/i)).toBeInTheDocument();
    expect(screen.getByText(/1800/i)).toBeInTheDocument();
    expect(screen.getByText('Flower 1 — 2 шт.')).toBeInTheDocument();
    expect(screen.getByText('Flower 2 — 1 шт.')).toBeInTheDocument();
  });
});
