import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";
import { fetchUserCart, fetchUserInfo, loginRequest, registerRequest, updateUserAddresses, updateUserName } from "../../api";
import { clearCart, mergeCart, setCart } from "./CartSlice";

const savedUser = sessionStorage.getItem("user");

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: savedUser ? true : false,
};

export const authUser = createAsyncThunk(
  "auth/authUser",
  async ({ email, password }: { email: string; password: string }, { dispatch }) => {
    const response = await loginRequest(email, password);
    const user: User = response.user;
    await dispatch(loginUser(user));
    return user;
  }
);

export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (user: User, { dispatch }) => {
		sessionStorage.setItem("user", JSON.stringify(user));
		const response = await fetchUserCart(user.email);
		dispatch(mergeCart(response.cart));
		return user;
	}
);

export const registerUser = createAsyncThunk(
	"auth/registerUser",
	async ({ email, password }: { email: string; password: string }, { dispatch }) => {
		const response = await registerRequest(email, password);
		const { user } = response;
		await dispatch(loginUser(user));
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
	async (email: string, { dispatch }) => {
		const user = await fetchUserInfo(email);
		sessionStorage.setItem("user", JSON.stringify(user));
		const response = await fetchUserCart(user.email);
		dispatch(setCart(response.cart));
		return user;
	}
);

type updateAddressesData = {
	email: string;
	addresses: string[];
	defaultIndex: number | null;
}

export const updateAddresses = createAsyncThunk(
	"auth/updateAddresses",
	async ({email, addresses, defaultIndex} : updateAddressesData, { dispatch }) => {
		await updateUserAddresses(email, addresses, defaultIndex);
		await dispatch(refreshUser(email));
	}
);

type UpdateNameData = {
	email: string;
	name: string;
}

export const updateName = createAsyncThunk(
	"auth/updateName",
	async ({email, name } : UpdateNameData, { dispatch }) => {
		await updateUserName(email, name);
		await dispatch(refreshUser(email));
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
