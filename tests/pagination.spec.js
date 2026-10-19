import { test, expect } from "@playwright/test";

for (const viewport of [
  { width: 1280, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
]) {
  test.describe(`pagination ${viewport.width}px`, () => {
    test.use({ viewport });
    test("все страницы доступны, фильтр и сортировка сбрасывают страницу", async ({
      page,
    }) => {
      const goods = Array.from({ length: 123 }, (_, index) => ({
        goodsID: `item-${index}`,
        brand: "TEST-BRAND",
        number: `PART-${index + 1}`,
        name: `Позиция ${String(index + 1).padStart(3, "0")}`,
        warehouses: [
          {
            id: "warehouse",
            code: "МСК",
            price: index + 1,
            stock: index % 2 === 0 ? 0 : 5,
          },
        ],
      }));
      await page.route("**/api/search*", (route) =>
        route.fulfill({ json: { goods } }),
      );
      await page.goto("/");
      await page.getByLabel("Артикул детали", { exact: true }).fill("TEST");
      await page.getByRole("button", { name: /TEST-BRAND/ }).click();
      const rows = page.locator("tbody tr");
      const next = page.getByRole("button", { name: "Следующая страница" });
      const previous = page.getByRole("button", {
        name: "Предыдущая страница",
      });
      const allNames = [];
      for (let currentPage = 1; currentPage <= 3; currentPage++) {
        await expect(
          page.getByText(`Страница ${currentPage} из 3`, { exact: true }),
        ).toBeVisible();
        await expect(rows).toHaveCount(currentPage < 3 ? 50 : 23);
        allNames.push(
          ...(await rows.locator("td:nth-child(2) > span").allTextContents()),
        );
        if (currentPage === 1) await expect(previous).toBeDisabled();
        if (currentPage < 3) await next.click();
      }
      expect(allNames).toEqual(goods.map((item) => item.name));
      expect(new Set(allNames).size).toBe(123);
      await expect(next).toBeDisabled();
      await previous.click();
      await expect(rows.first()).toContainText("Позиция 051");
      await next.click();
      await page.getByLabel("Только в наличии").check();
      await expect(
        page.getByText("Страница 1 из 2", { exact: true }),
      ).toBeVisible();
      await expect(rows.first()).toContainText("Позиция 002");
      await next.click();
      await expect(rows).toHaveCount(11);
      await expect(rows.last()).toContainText("Позиция 122");
      await page.getByLabel("Сортировка предложений").selectOption("price");
      await expect(
        page.getByText("Страница 1 из 2", { exact: true }),
      ).toBeVisible();
      await expect(rows.first()).toContainText("Позиция 002");
      await page.getByLabel("Только в наличии").uncheck();
      await expect(
        page.getByText("Страница 1 из 3", { exact: true }),
      ).toBeVisible();
      await expect(rows.first()).toContainText("Позиция 001");
    });
  });
}
