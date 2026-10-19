import { it, expect } from "vitest";
import reducer, {
  fetchBrands,
  fetchOffers,
  setNumber,
  selectBrand,
} from "@/features/parts/searchParts/model/searchSlice.js";
it("игнорирует ответ предыдущего артикула после изменения ввода", () => {
  let state = reducer(undefined, fetchBrands.pending("old", {}));
  state = reducer(state, setNumber("new"));
  state = reducer(state, fetchBrands.fulfilled([{ brand: "OLD" }], "old", {}));
  expect(state.brands).toEqual([]);
});
it("игнорирует предложения предыдущего производителя", () => {
  let state = reducer(undefined, fetchOffers.pending("old", {}));
  state = reducer(state, selectBrand("NEW"));
  state = reducer(state, fetchOffers.fulfilled([{ id: "old" }], "old", {}));
  expect(state.offers).toEqual([]);
});
