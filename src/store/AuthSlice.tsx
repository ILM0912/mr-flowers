import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { fetchUserCart, fetchUserInfo } from "../api";
import { clearCart, mergeCart } from "./CartSlice";

const savedUser = sessionStorage.getItem("user");

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: savedUser ? true : false,
};

export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (user: User, { dispatch, rejectWithValue }) => {
		sessionStorage.setItem("user", JSON.stringify(user));

		const response = await fetchUserCart(user.email);
		dispatch(mergeCart(response.cart));

		return user;
	}
);

export const logoutUser = createAsyncThunk(
	"auth/logoutUser",
	async (_, { dispatch }) => {
		sessionStorage.removeItem("user");
		dispatch(clearCart());
	}
);

export const refreshUser = createAsyncThunk(
	"auth/refreshUser",
	async (email: string) => {
		const user = await fetchUserInfo(email);
		sessionStorage.setItem("user", JSON.stringify(user));
		return user;
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.user = action.payload;
				state.isAuthenticated = true;
			})
			.addCase(loginUser.rejected, (_, action) => {
				console.warn("Ошибка авторизации: ", action.error.message || "не удалось войти в аккаунт");
			})
			.addCase(logoutUser.fulfilled, state => {
				state.user = null;
				state.isAuthenticated = false;
			})
			.addCase(refreshUser.fulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addCase(refreshUser.rejected, (_, action) => {
				console.warn("Ошибка обновления пользователя:", action.error.message || "не удалось загрузить данные");
			});
	}
});

export default authSlice.reducer;
