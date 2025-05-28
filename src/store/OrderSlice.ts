import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { checkPromoCode, createOrderRequest } from "../api";
import { CartItemType, OrderCreateRequestType } from "../types";

type OrderState = {
    items: CartItemType[];
	discount: number;
    promoMessage: string | null;
    promoError: string | null;
    status: "idle" | "loading" | "success" | "error";
	error: string | null;
};

const initialState: OrderState = {
    promoMessage: null,
    promoError: null,
    items: [],
	discount: 0,
	status: "idle",
	error: null,
};

export const checkPromo = createAsyncThunk(
	"order/checkPromo",
	async ({ email, promocode } : {email: string, promocode: string}) => {
		const data = await checkPromoCode(email, promocode);
        return data;
	}
);

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (order: OrderCreateRequestType) => {
		const data = await createOrderRequest(order);
		return data;
});

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrderItems: (state, action: PayloadAction<CartItemType[]>) => {
            state.items = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkPromo.pending, (state) => {
                state.error = null;
                state.promoMessage = null;
                state.promoError = null;
                state.discount = 0;
            })
            .addCase(checkPromo.fulfilled, (state, action: PayloadAction<{message: string, discount: number}>) => {
                state.discount = action.payload.discount | 0;
                state.promoMessage = action.payload.message;
            })
            .addCase(checkPromo.rejected, (state, action) => {
                state.promoError = action.error.message || "Ошибка при проверке промокода";
                state.promoMessage = null;
                state.discount = 0;
            })
            .addCase(createOrder.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state) => {
                state.status = "success";
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = "error";
                state.error = action.error.message || "Ошибка при оформлении заказа";
            });
    },
});

export const { setOrderItems } = orderSlice.actions;
export default orderSlice.reducer;
