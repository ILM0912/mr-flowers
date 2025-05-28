import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from './CartItem';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { CartItemType } from 'src/types';

const mockStore = configureMockStore();
const store = mockStore({
  cart: { items: [] },
});

const product = {
  id: '1',
  name: "Test Flower",
  price: 1000,
  image: "flower.jpg",
  rating: 0.0,
  category: 'цветок',
  reviews_length: 0
};

const item: CartItemType = {
  product,
  quantity: 2,
};

describe('CartItem', () => {
  it('отображает имя, цену, изображение и количество', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartItem
            item={item}
            checked={true}
            onCheck={jest.fn()}
            onRemove={jest.fn()}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Test Flower/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Test Flower/i)).toHaveAttribute('src', expect.stringContaining(product.image));
    expect(screen.getByText(/₽/)).toHaveTextContent('2 000 ₽');
  });

  it('вызывает onCheck при клике по чекбоксу', () => {
    const handleCheck = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <CartItem
            item={item}
            checked={false}
            onCheck={handleCheck}
            onRemove={jest.fn()}
          />
        </BrowserRouter>
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleCheck).toHaveBeenCalledTimes(1);
  });

  it('вызывает onRemove при клике на иконку удаления', () => {
    const handleRemove = jest.fn();

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <CartItem
            item={item}
            checked={true}
            onCheck={jest.fn()}
            onRemove={handleRemove}
          />
        </BrowserRouter>
      </Provider>
    );

    const removeButton = container.querySelector('.remove');
    expect(removeButton).toBeInTheDocument();
    fireEvent.click(removeButton!);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});
