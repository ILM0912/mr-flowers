import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getDetailedProduct } from "../../api";
import { DetailedProduct } from "../../types";

interface ProductState {
	selectedProduct: DetailedProduct | null;
	loading: boolean;
	error: string | null;
}

const initialState: ProductState = {
	selectedProduct: null,
	loading: false,
	error: null,
};

export const fetchDetailedProduct = createAsyncThunk<
	DetailedProduct,
	string,
	{ rejectValue: string }
>(
	"product/fetchDetailedProduct",
	async (id, { rejectWithValue }) => {
		try {
			const product = await getDetailedProduct(id);
			if (!product) return rejectWithValue("Товар не найден");
			return product;
		} catch (err) {
			return rejectWithValue("Ошибка при загрузке товара");
		}
	}
);

const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchDetailedProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDetailedProduct.fulfilled, (state, action: PayloadAction<DetailedProduct>) => {
				state.loading = false;
				state.selectedProduct = action.payload;
			})
			.addCase(fetchDetailedProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Неизвестная ошибка";
				state.selectedProduct = null;
			});
	},
});

export default productSlice.reducer;
