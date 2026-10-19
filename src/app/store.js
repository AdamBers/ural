import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "@/features/parts/searchParts/model/searchSlice.js";
export const store = configureStore({ reducer: { search: searchReducer } });
