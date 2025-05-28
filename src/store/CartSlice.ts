import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItemType } from '../types';
import { updateUserCart } from '../api';

const MAX_QUANTITY = 101;

const saveCart = (items: CartItemType[]) => {
	sessionStorage.setItem('cart', JSON.stringify(items));
	const email = JSON.parse(sessionStorage.getItem("user") || "{}").email;
	if (email) {
		updateUserCart(email, items)
			.catch(e =>console.warn('Ошибка при синхронизации корзины с сервером:', e));
	}
};

export interface CartState {
	items: CartItemType[];
	loaded: boolean;
}

const initialState: CartState = {
	items: [],
	loaded: false
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
			saveCart(state.items);
		},

		removeFromCart(state, action: PayloadAction<string>) {
			state.items = state.items.filter(item => item.product.id !== action.payload);
			saveCart(state.items);
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
			saveCart(state.items);
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
			saveCart(state.items);
		},

		clearCart(state) {
			state.items = [];
			sessionStorage.removeItem('cart');
		},
	},
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, mergeCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
