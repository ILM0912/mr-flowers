import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PersonalAccount from './PersonalAccount';
import { User } from '../../types';

jest.mock('../../../src/images/edit.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../../src/images/bonus.svg', () => ({
  ReactComponent: () => <svg />,
}));

jest.mock('../../store/AuthSlice', () => ({
  logoutUser: () => ({ type: 'LOGOUT_USER' }),
  refreshUser: (email: string) => ({ type: 'REFRESH_USER', payload: email }),
}));

jest.mock('../../api', () => ({
  updateUserName: jest.fn(() => Promise.resolve()),
}));

const mockStore = configureStore([]);

const user: User = {
  email: 'test@example.com',
  bonuses: 1500,
  defaultAddress: 0,
  address: ['ул. Ленина, 1', 'пр. Мира, 20'],
  name: 'Тест Пользователь',
  orders: [],
};

describe('PersonalAccount', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { user },
    });
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <PersonalAccount user={user} />
      </Provider>
    );

  it('отрисовывает имя и email пользователя', () => {
    renderComponent();
    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email.toLowerCase())).toBeInTheDocument();
  });

  it('позволяет переключаться в режим редактирования имени и сохранять изменения', async () => {
    renderComponent();

    fireEvent.click(screen.getByText(user.name));

    const input = screen.getByDisplayValue(user.name);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Новое Имя' } });
    fireEvent.blur(input);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual({ type: 'REFRESH_USER', payload: user.email });
    });
  });

  it('вызывает logoutUser при клике на "Выйти из аккаунта"', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Выйти из аккаунта/i));

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'LOGOUT_USER' });
  });
});
