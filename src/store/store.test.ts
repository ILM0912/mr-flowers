import { RootState, store } from './store';

describe('Redux-хранилище', () => {
	it('должно содержать корректное начальное состояние', () => {
		const state: RootState = store.getState();

		expect(state).toHaveProperty('auth');
		expect(state).toHaveProperty('cart');
		expect(state).toHaveProperty('product');
		expect(state).toHaveProperty('order');
	});
});
