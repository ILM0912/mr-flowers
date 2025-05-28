import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { fetchUserCart, fetchUserInfo } from "../api";
import { clearCart, mergeCart } from "./CartSlice";
import { AppDispatch } from ".";

const savedUser = sessionStorage.getItem("user");

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: savedUser ? true : false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action: PayloadAction<{ user: User }>) {
			state.user = action.payload.user;
			state.isAuthenticated = true;
			sessionStorage.setItem("user", JSON.stringify(action.payload.user));
		},

		logout(state) {
			state.user = null;
			state.isAuthenticated = false;
			sessionStorage.removeItem("user");
		},

		setUser(state, action: PayloadAction<User>) {
			state.user = action.payload;
			sessionStorage.setItem("user", JSON.stringify(action.payload));
		},
	},
});

export const loginUser = (user: User) => async (dispatch: AppDispatch) => {
	dispatch(login({ user }));
	fetchUserCart(user.email)
		.then((data) => {
			dispatch(mergeCart(data.cart));
		})
		.catch((err) => {
			console.warn("Ошибка загрузки корзины", err);
		});
};

export const logoutUser = () => (dispatch : AppDispatch) => {
	dispatch(clearCart());
	dispatch(logout());
};

export const refreshUser = (email: string) => async (dispatch: AppDispatch) => {
	fetchUserInfo(email)
		.then((data) => {
        	dispatch(setUser(data));
		})
		.catch((error) => console.warn("Ошибка при обновлении пользователя", error));
};

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
