import { describe, it, expect } from "vitest";
import { getBrands, getOffers } from "@/entities/parts/normalize.js";
describe("каталог", () => {
  it("оставляет уникальных производителей", () =>
    expect(
      getBrands([{ brand: "BOSCH" }, { brand: "BOSCH" }, { brand: "MANN" }]),
    ).toHaveLength(2));
  it("берёт цену и остаток со склада, а не из legacy-полей товара", () => {
    const [offer] = getOffers([
      {
        number: "A",
        brand: "B",
        price: 1,
        count: 999,
        warehouses: [{ id: "1", price: 800, stock: 3 }],
      },
    ]);
    expect(offer).toMatchObject({ price: 800, stock: 3, analogue: false });
  });
  it("разворачивает аналоги и несколько складов без дубликатов", () => {
    const analogue = {
      number: "C",
      brand: "D",
      warehouses: [{ id: "x", price: 10, stock: 2 }],
    };
    const offers = getOffers([
      {
        number: "A",
        brand: "B",
        warehouses: [
          { id: "1", price: 8 },
          { id: "2", price: 9 },
        ],
        analogues: [analogue, analogue],
      },
    ]);
    expect(offers).toHaveLength(3);
    expect(offers[2].analogue).toBe(true);
  });
  it("не подставляет общую цену при отсутствии складов", () =>
    expect(
      getOffers([{ number: "A", brand: "B", price: 100 }])[0],
    ).toMatchObject({ price: null, stock: 0 }));
});
