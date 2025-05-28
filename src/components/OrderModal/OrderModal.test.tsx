import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderModal from './OrderModal';

jest.mock('../../../src/images/loading.svg', () => ({
  ReactComponent: () => <svg data-testid="loading" />,
}));
jest.mock('../../../src/images/error.svg', () => ({
  ReactComponent: () => <svg data-testid="error" />,
}));
jest.mock('../../../src/images/success.svg', () => ({
  ReactComponent: () => <svg data-testid="success" />,
}));

describe('OrderModal', () => {
  it('отображает состояние загрузки', () => {
    render(<OrderModal status="loading" onExit={jest.fn()} />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Идёт оформление заказа...')).toBeInTheDocument();
  });

  it('отображает состояние успеха', () => {
    render(<OrderModal status="success" onExit={jest.fn()} />);
    expect(screen.getByTestId('success')).toBeInTheDocument();
    expect(screen.getByText('Ваш заказ успешно оформлен!')).toBeInTheDocument();
  });

  it('отображает состояние ошибки', () => {
    render(<OrderModal status="error" onExit={jest.fn()} />);
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByText('Произошла ошибка при оформлении заказа.')).toBeInTheDocument();
  });

  it('вызвает onExit при клике на оверлей', () => {
    const onExitMock = jest.fn();
    render(<OrderModal status="success" onExit={onExitMock} />);

    fireEvent.click(screen.getByText('Ваш заказ успешно оформлен!').parentElement!.parentElement!);
    expect(onExitMock).toHaveBeenCalled();
  });

  it('не вызывает onExit при клике внутри модального окна', () => {
    const onExitMock = jest.fn();
    render(<OrderModal status="error" onExit={onExitMock} />);

    const modal = screen.getByText('Произошла ошибка при оформлении заказа.').parentElement!;
    fireEvent.click(modal);
    expect(onExitMock).not.toHaveBeenCalled();
  });
});
