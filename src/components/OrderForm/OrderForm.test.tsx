import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import OrderForm from './OrderForm';
import { Product, User } from 'src/types';

const mockStore = configureStore([]);
jest.mock('../../../src/images/loading.svg', () => ({
  ReactComponent: () => <svg data-testid="loading" />,
}));
jest.mock('../../../src/images/error.svg', () => ({
  ReactComponent: () => <svg data-testid="error" />,
}));
jest.mock('../../../src/images/success.svg', () => ({
  ReactComponent: () => <svg data-testid="success" />,
}));

const product1: Product = {
  id: '1',
  name: 'Flower 1',
  price: 1000,
  image: 'flower1.jpg',
  rating: 0,
  reviews_length: 0,
  category: 'цветы',
};

const product2: Product = {
  id: '2',
  name: 'Flower 2',
  price: 800,
  image: 'flower2.jpg',
  rating: 0,
  reviews_length: 0,
  category: 'цветы',
};

const user: User = {
  email: 'test@example.com',
  bonuses: 200,
  defaultAddress: 0,
  address: ['ул. Ленина, 1', 'пр. Мира, 20'],
  name: 'Тест',
  orders: [],
};

describe('OrderForm', () => {
  let store: any;
  const onExit = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    store = mockStore({
      auth: { user },
      order: {
        items: [
          { product: product1, quantity: 2 },
          { product: product2, quantity: 1 },
        ],
        discount: 0,
        promoMessage: null,
        promoError: null,
        status: 'idle',
        error: null,
      },
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <OrderForm onExit={onExit} onSubmit={onSubmit} />
      </Provider>
    );

  it('отрисовывает список товаров', () => {
    renderComponent();
    expect(screen.getByText('Flower 1')).toBeInTheDocument();
    expect(screen.getByText('Flower 2')).toBeInTheDocument();
  });

  it('отображает и меняет номер телефона', () => {
    renderComponent();
    const phoneInput = screen.getByPlaceholderText(/Введите номер телефон получателя/i);
    fireEvent.change(phoneInput, { target: { value: '71234567890' } });
    expect(phoneInput).toHaveValue('71234567890');
  });

  it('позволяет выбрать адрес доставки', () => {
    renderComponent();

    const firstAddress = screen.getByLabelText('ул. Ленина, 1');
    expect(firstAddress).toBeChecked();

    const secondAddress = screen.getByLabelText('пр. Мира, 20');
    fireEvent.click(secondAddress);
    expect(secondAddress).toBeChecked();

    const customAddress = screen.getByLabelText('Другой адрес');
    fireEvent.click(customAddress);
    expect(customAddress).toBeChecked();

    const customInput = screen.getByPlaceholderText(/Введите адрес доставки/i);
    fireEvent.change(customInput, { target: { value: 'ул. Новая, 5' } });
    expect(customInput).toHaveValue('ул. Новая, 5');
  });

  it('вводит дату и время доставки', () => {
    renderComponent();

    const dateInput = screen.getByDisplayValue(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    fireEvent.change(dateInput, { target: { value: '2099-12-31' } });
    expect(dateInput).toHaveValue('2099-12-31');

    const timeSelect = screen.getByRole('combobox');
    fireEvent.change(timeSelect, { target: { value: '09:00' } });
    expect(timeSelect).toHaveValue('09:00');
  });

  it('чекбокс бонусов меняет состояние', () => {
    renderComponent();
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('промокод автоматически переводится в верхний регистр', () => {
    renderComponent();
    const promoInput = screen.getByPlaceholderText(/Введите промокод/i);
    fireEvent.change(promoInput, { target: { value: 'testcode' } });
    expect(promoInput).toHaveValue('TESTCODE');
  });

  it('кнопка "Заказать" отключена при невалидных данных', () => {
    renderComponent();
    const orderButton = screen.getByRole('button', { name: /Заказать за/i });
    expect(orderButton).toBeDisabled();
  });

  it('успешное заполнение формы', async () => {
    renderComponent();

    const phoneInput = screen.getByPlaceholderText(/Введите номер телефон получателя/i);
    fireEvent.input(phoneInput, { target: { value: '89043540555' } });

    const timeSelect = screen.getByRole('combobox');
    fireEvent.change(timeSelect, { target: { value: '09:00' } });

    const orderButton = screen.getByRole('button', { name: /Заказать за/i });
    expect(orderButton).toBeEnabled();
  });

  it('вызов onExit при клике "Назад"', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Назад'));
    expect(onExit).toHaveBeenCalled();
  });
});
