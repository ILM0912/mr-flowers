import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewForm from './ReviewForm';
import * as api from '../../api';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

jest.mock('../../api');
jest.mock('../../images/star-active.svg', () => ({
  ReactComponent: () => <svg />,
}));
jest.mock('../../images/star.svg', () => ({
  ReactComponent: () => <svg />,
}));

const sendReviewMock = api.sendReview as jest.Mock;
const mockStore = configureStore([]);

describe('ReviewForm', () => {
  const productId = '123';
  const fakeEmail = 'test@example.com';

  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      auth: { user: { email: fakeEmail } }
    });

    sendReviewMock.mockClear();
    delete (window as any).location;
    (window as any).location = { reload: jest.fn() };
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <ReviewForm productId={productId} />
      </Provider>
    );

  it('показывает форму при клике на кнопку "Оставить отзыв"', () => {
    renderComponent();
    expect(screen.queryByText('Оставьте отзыв:')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Оставить отзыв'));

    expect(screen.getByText('Оставьте отзыв:')).toBeInTheDocument();
  });

  it('изменение текста обновляет поле', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Оставить отзыв'));

    const textarea = screen.getByPlaceholderText('Напишите, что вам понравилось или не понравилось');
    fireEvent.change(textarea, { target: { value: 'Новый отзыв' } });

    expect(textarea).toHaveValue('Новый отзыв');
  });

  it('нажатие на кнопку "Отправить" вызывает sendReview с правильными данными', async () => {
    sendReviewMock.mockResolvedValue(undefined);

    renderComponent();
    fireEvent.click(screen.getByText('Оставить отзыв'));

    const textarea = screen.getByPlaceholderText('Напишите, что вам понравилось или не понравилось');
    fireEvent.change(textarea, { target: { value: 'Отличный продукт!' } });

    fireEvent.click(screen.getByText('Отправить'));

    await waitFor(() => {
      expect(sendReviewMock).toHaveBeenCalledWith({
        productId,
        stars: 5,
        text: 'Отличный продукт!',
        email: fakeEmail,
      });
    });
  });

  it('если sendReview возвращает ошибку, форма скрывается', async () => {
    sendReviewMock.mockRejectedValue(new Error('Ошибка сети'));

    renderComponent();
    fireEvent.click(screen.getByText('Оставить отзыв'));

    fireEvent.change(screen.getByPlaceholderText('Напишите, что вам понравилось или не понравилось'), { target: { value: 'Текст' } });
    fireEvent.click(screen.getByText('Отправить'));

    await waitFor(() => {
      expect(screen.queryByText('Оставьте отзыв:')).not.toBeInTheDocument();
    });
  });

  it('кнопка "Назад" скрывает форму и сбрасывает поля', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Оставить отзыв'));

    const textarea = screen.getByPlaceholderText('Напишите, что вам понравилось или не понравилось');
    fireEvent.change(textarea, { target: { value: 'Тест' } });

    fireEvent.click(screen.getByText('Назад'));

    expect(screen.queryByText('Оставьте отзыв:')).not.toBeInTheDocument();
    expect(textarea).not.toBeInTheDocument();
  });
});
