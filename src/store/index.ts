import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './CartSlice';
import authReducer from "./AuthSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		cart: cartReducer,
	},
});

export default store;
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;