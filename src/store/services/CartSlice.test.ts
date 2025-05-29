import { CartItemType } from 'src/types';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  mergeCart,
  setCart,
  CartState,
  saveCartMiddleware
} from './CartSlice';
import { MiddlewareAPI } from '@reduxjs/toolkit';
import * as api from '../../api';jest.mock('../../api', () => ({
  updateUserCart: jest.fn().mockResolvedValue(undefined),
}));

const mockItem = (id: string, quantity = 1) => ({
    product: {
        id,
        name: 'Test Product',
        price: 100,
        category: 'flowers',
        image: 'image.jpg',
        rating: 4.5,
        reviews_length: 10,
    },
    quantity,
});

describe('cartSlice', () => {
  let initialState: CartState;

  beforeEach(() => {
    initialState = {
      items: [],
      loaded: false,
    };
  });

  it('setCart: устанавливает корзину и loaded=true', () => {
    const items = [mockItem('1', 2)];
    const state = cartReducer(initialState, setCart(items));
    expect(state.items).toEqual(items);
    expect(state.loaded).toBe(true);
  });

  it('addToCart: добавляет новый товар', () => {
    const item = mockItem('1', 2);
    const state = cartReducer(initialState, addToCart(item));
    expect(state.items).toEqual([item]);
  });

  it('addToCart: увеличивает количество, если товар уже есть', () => {
    const startState: CartState = {
      ...initialState,
      items: [mockItem('1', 1)],
    };
    const state = cartReducer(startState, addToCart(mockItem('1', 2)));
    expect(state.items[0].quantity).toBe(3);
  });

  it('addToCart: не превышает MAX_QUANTITY', () => {
    const startState: CartState = {
      ...initialState,
      items: [mockItem('1', 100)],
    };
    const state = cartReducer(startState, addToCart(mockItem('1', 10)));
    expect(state.items[0].quantity).toBe(101);
  });

  it('removeFromCart: удаляет товар по id', () => {
    const startState: CartState = {
      ...initialState,
      items: [mockItem('1'), mockItem('2')],
    };
    const state = cartReducer(startState, removeFromCart('1'));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe('2');
  });

  it('updateQuantity: обновляет количество', () => {
    const startState: CartState = {
      ...initialState,
      items: [mockItem('1', 2)],
    };
    const state = cartReducer(startState, updateQuantity({ id: '1', quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);
  });

  it('updateQuantity: удаляет товар, если количество <= 0', () => {
    const startState: CartState = {
      ...initialState,
      items: [mockItem('1', 2)],
    };
    const state = cartReducer(startState, updateQuantity({ id: '1', quantity: 0 }));
    expect(state.items).toHaveLength(0);
  });

  it('mergeCart: объединяет корзины и увеличивает количество существующего товара', () => {
    const startState: CartState = {
      ...initialState,
      items: [mockItem('1', 2)],
    };
    const incoming = [mockItem('1', 3), mockItem('2', 1)];
    const state = cartReducer(startState, mergeCart(incoming));
    expect(state.items.find(i => i.product.id === '1')?.quantity).toBe(5);
    expect(state.items.find(i => i.product.id === '2')?.quantity).toBe(1);
  });

  it('mergeCart: не превышает MAX_QUANTITY', () => {
    const startState: CartState = {
      ...initialState,
      items: [mockItem('1', 100)],
    };
    const incoming = [mockItem('1', 10)];
    const state = cartReducer(startState, mergeCart(incoming));
    expect(state.items[0].quantity).toBe(101);
  });

  it('clearCart: очищает корзину и ставит loaded=true', () => {
    const startState: CartState = {
      ...initialState,
      items: [mockItem('1', 2)],
      loaded: false,
    };
    const state = cartReducer(startState, clearCart());
    expect(state.items).toEqual([]);
    expect(state.loaded).toBe(true);
  });

  
  describe('saveCartMiddleware', () => {
    const cartItem: CartItemType = {
        product: {
            id: '1',
            name: 'Test Product',
            price: 100,
            category: 'flowers',
            image: 'image.jpg',
            rating: 4.5,
            reviews_length: 10,
        },
        quantity: 2,
    };

    let store: MiddlewareAPI;
    let next: (action: unknown) => unknown;

    beforeEach(() => {
        store = {
        getState: () => ({
            cart: { items: [cartItem] },
        }),
        dispatch: jest.fn(),
        };
        next = jest.fn(action => action);
        sessionStorage.clear();
        jest.clearAllMocks();
    });

    it('сохраняет корзину в sessionStorage и вызывает updateUserCart при наличии email', () => {
        sessionStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));

        const action = addToCart(cartItem);
        saveCartMiddleware(store)(next)(action);

        expect(sessionStorage.getItem('cart')).toEqual(JSON.stringify([cartItem]));
        expect(api.updateUserCart).toHaveBeenCalledWith('test@example.com', [cartItem]);
        expect(next).toHaveBeenCalledWith(action);
    });

    it('не вызывает updateUserCart, если в sessionStorage нет email', () => {
        sessionStorage.setItem('user', JSON.stringify({}));

        const action = addToCart(cartItem);
        saveCartMiddleware(store)(next)(action);

        expect(api.updateUserCart).not.toHaveBeenCalled();
    });

    it('ничего не делает для других экшенов', () => {
        const unrelatedAction = { type: 'unrelated/action' };
        saveCartMiddleware(store)(next)(unrelatedAction);

        expect(next).toHaveBeenCalledWith(unrelatedAction);
        expect(api.updateUserCart).not.toHaveBeenCalled();
        expect(sessionStorage.getItem('cart')).toBeNull();
    });
    });
});
