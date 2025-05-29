import reducer, { fetchDetailedProduct } from './ProductSlice';
import { DetailedProduct } from '../../types';

describe('productSlice', () => {
	const initialState = {
		selectedProduct: null,
		loading: false,
		error: null,
	};

	it('должен вернуть начальное состояние', () => {
		expect(reducer(undefined, { type: '' })).toEqual(initialState);
	});

	it('должен установить loading в true при fetchDetailedProduct.pending', () => {
		const nextState = reducer(initialState, fetchDetailedProduct.pending('', '123'));
		expect(nextState.loading).toBe(true);
		expect(nextState.error).toBeNull();
	});

	it('должен установить selectedProduct при fetchDetailedProduct.fulfilled', () => {
		const mockProduct: DetailedProduct = {
            id: '123',
            name: 'Роза',
            price: 1000,
            image: '/rose.jpg',
            description: 'Цветок роза',
            reviews: [],
            category: '',
            rating: 0,
            reviews_length: 0
        };

		const action = fetchDetailedProduct.fulfilled(mockProduct, '', '123');
		const nextState = reducer(initialState, action);

		expect(nextState.selectedProduct).toEqual(mockProduct);
		expect(nextState.loading).toBe(false);
	});

	it('должен установить ошибку и selectedProduct = null при fetchDetailedProduct.rejected', () => {
		const action = fetchDetailedProduct.rejected(new Error(), '', '123', 'Ошибка при загрузке');
		const nextState = reducer(initialState, action);

		expect(nextState.loading).toBe(false);
		expect(nextState.error).toBe('Ошибка при загрузке');
		expect(nextState.selectedProduct).toBeNull();
	});
});
