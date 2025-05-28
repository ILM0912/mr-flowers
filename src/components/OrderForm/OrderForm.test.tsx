import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
jest.mock('../../store/AuthSlice', () => ({
  refreshUser: () => ({ type: 'REFRESH_USER' })
}));
import { createOrder } from '../../api';
jest.mock('../../api', () => ({
  createOrder: jest.fn(),
}));
import OrderForm from './OrderForm';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Product, User } from 'src/types';
jest.mock('../../images/error.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../images/success.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../images/loading.svg', () => ({
  ReactComponent: () => <svg />,
}));

const mockStore = configureStore([]);

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

const user: User = {
  email: 'test@example.com',
  bonuses: 200,
  defaultAddress: 0,
  address: ['ул. Ленина, 1', 'пр. Мира, 20'],
  name: 'Тест',
  orders: []
};

describe('OrderForm', () => {
  let store: any;
  const onExit = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    store = mockStore({
      auth: { user: user },
    });
    (createOrder as jest.Mock).mockResolvedValueOnce(undefined);
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <OrderForm items={dummyItems} onExit={onExit} onSubmit={onSubmit} />
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
    expect(phoneInput).toBeInTheDocument();

    fireEvent.change(phoneInput, { target: { value: '71234567890' } });
    expect(phoneInput).toHaveValue('71234567890');
  });

  it('позволяет выбрать адрес доставки', () => {
    renderComponent();
    const addressRadio = screen.getByLabelText('ул. Ленина, 1');
    expect(addressRadio).toBeChecked();

    const secondAddressRadio = screen.getByLabelText('пр. Мира, 20');
    fireEvent.click(secondAddressRadio);
    expect(secondAddressRadio).toBeChecked();

    const customAddressRadio = screen.getByLabelText('Другой адрес');
    fireEvent.click(customAddressRadio);
    expect(customAddressRadio).toBeChecked();

    const customAddressInput = screen.getByPlaceholderText(/Введите адрес доставки/i);
    fireEvent.change(customAddressInput, { target: { value: 'ул. Новая, 5' } });
    expect(customAddressInput).toHaveValue('ул. Новая, 5');
  });

  it('вводит дату и время доставки', () => {
    renderComponent();
    const dateInput = screen.getByDisplayValue(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    expect(dateInput).toBeInTheDocument();

    fireEvent.change(dateInput, { target: { value: '2099-12-31' } });
    expect(dateInput).toHaveValue('2099-12-31');

    const selectTime = screen.getByRole('combobox');
    fireEvent.change(selectTime, { target: { value: '09:00' } });
    expect(selectTime).toHaveValue('09:00');
  });

  it('чекбокс бонусов меняет состояние', () => {
    renderComponent();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

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

  it('открывает модальное окно при нажатии кнопки заказа', async () => {
    renderComponent();

    const phoneInput = screen.getByPlaceholderText(/Введите номер телефон получателя/i);
    fireEvent.input(phoneInput, { target: { value: '89043540555' } });

    const selectTime = screen.getByRole('combobox');
    fireEvent.change(selectTime, { target: { value: '09:00' } });

    const orderButton = screen.getByRole('button', { name: /Заказать за/i });
    expect(orderButton).toBeEnabled();

    fireEvent.click(orderButton);

    await waitFor(() => {
      expect(screen.getByText("Ваш заказ успешно оформлен!")).toBeInTheDocument();
    });
  });

  it('вызов onExit при клике на "Назад"', () => {
    renderComponent();
    const backElement = screen.getByText('Назад');
    fireEvent.click(backElement);
    expect(onExit).toHaveBeenCalled();
  });
});
