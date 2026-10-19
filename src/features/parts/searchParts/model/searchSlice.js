import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchParts, getErrorMessage } from "@/entities/parts/api.js";
import { getBrands, getOffers } from "@/entities/parts/normalize.js";
export const fetchBrands = createAsyncThunk(
  "search/brands",
  async (args, { signal, rejectWithValue }) => {
    try {
      return getBrands(await searchParts(args, signal));
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
export const fetchOffers = createAsyncThunk(
  "search/offers",
  async (args, { signal, rejectWithValue }) => {
    try {
      return getOffers(await searchParts(args, signal));
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
const initialState = {
  number: "",
  brand: "",
  mode: "live",
  brands: [],
  offers: [],
  brandsStatus: "idle",
  offersStatus: "idle",
  error: "",
  brandsRequestId: null,
  offersRequestId: null,
};
const slice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setNumber: (state, { payload }) => {
      if (state.number === payload) return;
      return { ...initialState, mode: state.mode, number: payload };
    },
    setMode: (state, { payload }) => ({
      ...initialState,
      mode: payload,
      number: state.number,
    }),
    selectBrand: (state, { payload }) => {
      if (state.brand === payload) return;
      state.brand = payload;
      state.offers = [];
      state.offersStatus = "idle";
      state.offersRequestId = null;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    for (const [thunk, key] of [
      [fetchBrands, "brands"],
      [fetchOffers, "offers"],
    ]) {
      builder.addCase(thunk.pending, (state, action) => {
        state[`${key}Status`] = "loading";
        state[`${key}RequestId`] = action.meta.requestId;
        state.error = "";
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        if (state[`${key}RequestId`] !== action.meta.requestId) return;
        state[key] = action.payload;
        state[`${key}Status`] = "success";
      });
      builder.addCase(thunk.rejected, (state, action) => {
        if (state[`${key}RequestId`] !== action.meta.requestId) return;
        state[`${key}Status`] = action.meta.aborted ? "idle" : "error";
        state.error = action.meta.aborted ? "" : action.payload;
      });
    }
  },
});
export const { setNumber, setMode, selectBrand } = slice.actions;
export default slice.reducer;
