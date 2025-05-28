import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuantityCounter from './QuantityCounter';

import { useDispatch } from 'react-redux';

const dispatchMock = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('QuantityCounter', () => {
  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    dispatchMock.mockClear();
  });

  it('отображает начальное значение из пропсов', () => {
    render(<QuantityCounter id="1" quantity={5} />);
    expect(screen.getByRole('textbox')).toHaveValue('5');
  });

  it('обновляет input при изменении quantity в пропсах', () => {
    const { rerender } = render(<QuantityCounter id="1" quantity={5} />);
    expect(screen.getByRole('textbox')).toHaveValue('5');
    rerender(<QuantityCounter id="1" quantity={10} />);
    expect(screen.getByRole('textbox')).toHaveValue('10');
  });

  it('разрешает ввод только цифр', () => {
    render(<QuantityCounter id="1" quantity={1} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input).toHaveValue('1');
  });

  it('на onBlur вызывает dispatch с правильным количеством', () => {
    render(<QuantityCounter id="1" quantity={5} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.blur(input);

    expect(dispatchMock).toHaveBeenCalledWith({ type: 'cart/updateQuantity', payload: { id: '1', quantity: 10 } });
  });

  it('если ввод пустой или NaN, сбрасывает input в quantity из пропсов', () => {
    render(<QuantityCounter id="1" quantity={5} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(input).toHaveValue('5');
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('если ввод больше 101, устанавливает количество 101', () => {
    render(<QuantityCounter id="1" quantity={5} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '200' } });
    fireEvent.blur(input);

    expect(dispatchMock).toHaveBeenCalledWith({ type: 'cart/updateQuantity', payload: { id: '1', quantity: 101 } });
    expect(input).toHaveValue('101');
  });

  it('при нажатии кнопки + увеличивает количество на 1, если меньше 101', () => {
    render(<QuantityCounter id="1" quantity={5} />);
    const btn = screen.getByText('+');

    fireEvent.click(btn);

    expect(dispatchMock).toHaveBeenCalledWith({ type: 'cart/updateQuantity', payload: { id: '1', quantity: 6 } });
  });

  it('не увеличивает количество, если оно равно 101', () => {
    render(<QuantityCounter id="1" quantity={101} />);
    const btn = screen.getByText('+');

    fireEvent.click(btn);

    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('при нажатии кнопки - уменьшает количество на 1, если больше 1', () => {
    render(<QuantityCounter id="1" quantity={5} />);
    const btn = screen.getByText('−');

    fireEvent.click(btn);

    expect(dispatchMock).toHaveBeenCalledWith({ type: 'cart/updateQuantity', payload: { id: '1', quantity: 4 } });
  });

  it('если количество равно 1, при нажатии - устанавливает количество 0', () => {
    render(<QuantityCounter id="1" quantity={1} />);
    const btn = screen.getByText('−');

    fireEvent.click(btn);

    expect(dispatchMock).toHaveBeenCalledWith({ type: 'cart/updateQuantity', payload: { id: '1', quantity: 0 } });
  });

  it('применяет изменение при нажатии Enter', () => {
    render(<QuantityCounter id="1" quantity={5} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(dispatchMock).toHaveBeenCalledWith({ type: 'cart/updateQuantity', payload: { id: '1', quantity: 7 } });
  });
});
