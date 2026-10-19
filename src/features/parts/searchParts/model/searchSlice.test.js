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

it("открывает реальный каталог по умолчанию", () => {
  expect(reducer(undefined, { type: "init" }).mode).toBe("live");
});

it("повторный выбор артикула и бренда сохраняет уже загруженные предложения", () => {
  let state = reducer(undefined, setNumber("W 914/2"));
  state = reducer(state, fetchBrands.pending("brands", {}));
  state = reducer(
    state,
    fetchBrands.fulfilled([{ brand: "MANN-FILTER" }], "brands", {}),
  );
  state = reducer(state, selectBrand("MANN-FILTER"));
  state = reducer(state, fetchOffers.pending("offers", {}));
  state = reducer(
    state,
    fetchOffers.fulfilled([{ id: "offer-1", price: 100 }], "offers", {}),
  );
  const afterNumber = reducer(state, setNumber("W 914/2"));
  const afterBrand = reducer(afterNumber, selectBrand("MANN-FILTER"));
  expect(afterBrand.brands).toEqual([{ brand: "MANN-FILTER" }]);
  expect(afterBrand.offers).toEqual([{ id: "offer-1", price: 100 }]);
  expect(afterBrand.offersStatus).toBe("success");
});
