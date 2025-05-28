import { createSlice, PayloadAction, Middleware, isAnyOf } from '@reduxjs/toolkit';
import { CartItemType } from '../types';
import { updateUserCart } from '../api';

const MAX_QUANTITY = 101;

export interface CartState {
	items: CartItemType[];
	loaded: boolean;
}

const initialState: CartState = {
	items: [],
	loaded: false,
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCart(state, action: PayloadAction<CartItemType[]>) {
			state.items = action.payload;
			state.loaded = true;
		},

		addToCart(state, action: PayloadAction<CartItemType>) {
			const existing = state.items.find(item => item.product.id === action.payload.product.id);
			if (existing) {
				const newQty = existing.quantity + action.payload.quantity;
				existing.quantity = Math.min(newQty, MAX_QUANTITY);
			} else {
				const validQty = Math.max(1, Math.min(action.payload.quantity, MAX_QUANTITY));
				state.items.push({ ...action.payload, quantity: validQty });
			}
		},

		removeFromCart(state, action: PayloadAction<string>) {
			state.items = state.items.filter(item => item.product.id !== action.payload);
		},

		updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
			const { id, quantity } = action.payload;
			if (quantity <= 0) {
				state.items = state.items.filter(item => item.product.id !== id);
			} else {
				const item = state.items.find(item => item.product.id === id);
				if (item) {
					item.quantity = Math.min(quantity, MAX_QUANTITY);
				}
			}
		},

		mergeCart(state, action: PayloadAction<CartItemType[]>) {
			const incomingItems = action.payload;
			for (const incomingItem of incomingItems) {
				const existing = state.items.find(item => item.product.id === incomingItem.product.id);
				if (existing) {
					const combinedQty = existing.quantity + incomingItem.quantity;
					existing.quantity = Math.min(combinedQty, MAX_QUANTITY);
				} else {
					const validQty = Math.max(1, Math.min(incomingItem.quantity, MAX_QUANTITY));
					state.items.push({ ...incomingItem, quantity: validQty });
				}
			}
			state.loaded = true;
		},

		clearCart(state) {
			state.items = [];
			state.loaded = true;
		},
	},
});

export const {
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCart,
	mergeCart,
	setCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const saveCartMiddleware: Middleware = store => next => action => {
	const result = next(action);

	if (isAnyOf(addToCart,removeFromCart,updateQuantity,clearCart,mergeCart,setCart)(action)) {
		const state = store.getState();
		const items: CartItemType[] = state.cart.items;
		sessionStorage.setItem('cart', JSON.stringify(items));
		const user = JSON.parse(sessionStorage.getItem('user') || '{}');
		if (user.email) {
			updateUserCart(user.email, items).catch(e =>
				console.warn('Ошибка при синхронизации корзины с сервером:', e)
			);
		}
	}

	return result;
};
