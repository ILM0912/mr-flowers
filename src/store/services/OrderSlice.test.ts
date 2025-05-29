import reducer, { setOrderItems, checkPromo, createOrder } from './OrderSlice';
import { CartItemType } from '../../types';
import * as api from '../../api';
import { OrderCreateRequestType } from '../../types';
import { AnyAction } from '@reduxjs/toolkit';

jest.mock('../../api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('orderSlice', () => {
    const initialState = {
        promoMessage: null,
        promoError: null,
        items: [],
        discount: 0,
        status: 'idle' as 'idle',
        error: null,
    };

    const cartItem: CartItemType = {
        product: {
            id: '1',
            name: 'Test Product',
            price: 100,
            category: 'flowers',
            image: 'img.jpg',
            rating: 5,
            reviews_length: 10,
        },
        quantity: 2,
    };

    it('setOrderItems should set items', () => {
        const newState = reducer(initialState, setOrderItems([cartItem]));
        expect(newState.items).toEqual([cartItem]);
    });

    describe('checkPromo thunk', () => {
        it('fulfilled sets discount and promoMessage', () => {
            const action = {
                type: checkPromo.fulfilled.type,
                payload: { discount: 20, message: 'Успешно' },
            };
            const state = reducer(initialState, action);
            expect(state.discount).toBe(20);
            expect(state.promoMessage).toBe('Успешно');
            expect(state.promoError).toBeNull();
        });

        it('pending resets promo-related state', () => {
            const action = { type: checkPromo.pending.type };
            const state = reducer(
                { ...initialState, promoMessage: 'test', promoError: 'err', discount: 5 },
                action
            );
            expect(state.promoMessage).toBeNull();
            expect(state.promoError).toBeNull();
            expect(state.discount).toBe(0);
        });

        it('rejected sets promoError', () => {
            const action = {
                type: checkPromo.rejected.type,
                error: { message: 'Неверный код' },
            };
            const state = reducer(initialState, action as AnyAction);
            expect(state.promoError).toBe('Неверный код');
            expect(state.promoMessage).toBeNull();
            expect(state.discount).toBe(0);
        });

        it('checkPromo async dispatches fulfilled', async () => {
            mockedApi.checkPromoCode.mockResolvedValueOnce({ discount: 15, message: 'OK' });
            const dispatch = jest.fn();
            const thunk = checkPromo({ email: 'a@a.a', promocode: 'CODE' });
            await thunk(dispatch, () => ({}), undefined);
            expect(mockedApi.checkPromoCode).toHaveBeenCalledWith('a@a.a', 'CODE');
        });
    });

    describe('createOrder thunk', () => {
        it('pending sets status to loading', () => {
            const action = { type: createOrder.pending.type };
            const state = reducer(initialState, action);
            expect(state.status).toBe('loading');
            expect(state.error).toBeNull();
        });

        it('fulfilled sets status to success', () => {
            const action = { type: createOrder.fulfilled.type };
            const state = reducer({ ...initialState, status: 'loading' }, action);
            expect(state.status).toBe('success');
        });

        it('rejected sets error and status to error', () => {
            const action = {
                type: createOrder.rejected.type,
                error: { message: 'Ошибка заказа' },
            };
            const state = reducer({ ...initialState, status: 'loading' }, action as AnyAction);
            expect(state.status).toBe('error');
            expect(state.error).toBe('Ошибка заказа');
        });

        it('createOrder async dispatches fulfilled', async () => {
            const mockOrder: OrderCreateRequestType = {
                email: 'a@a.a',
                items: [cartItem],
                total: 180,
                phone: '123',
                deliveryAddress: 'Street',
                deliveryDate: '',
                deliveryTime: '',
                bonusesToUse: 0,
                finalTotal: 180
            };

            mockedApi.createOrderRequest.mockResolvedValueOnce({ success: true });
            const dispatch = jest.fn();
            const thunk = createOrder(mockOrder);
            await thunk(dispatch, () => ({}), undefined);
            expect(mockedApi.createOrderRequest).toHaveBeenCalledWith(mockOrder);
        });
    });
});
