import { test, expect } from "@playwright/test";
import { getDemoGoods } from "#src/entities/parts/demo.js";
for (const width of [320, 768, 1440]) {
  test.describe(`select ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    test("клавиатура, отмена, закрытие снаружи и границы меню", async ({
      page,
    }) => {
      await page.route("**/api/search*", (route) => {
        const url = new URL(route.request().url());
        return route.fulfill({
          json: {
            goods: getDemoGoods(
              url.searchParams.get("number"),
              url.searchParams.get("brand"),
            ),
          },
        });
      });
      await page.goto("/");
      await page.getByRole("button", { name: "W 914/2", exact: true }).click();
      await page.getByRole("button", { name: /MANN-FILTER/ }).click();
      const select = page.getByRole("combobox", {
        name: "Сортировка предложений",
      });
      await select.focus();
      await page.keyboard.press("ArrowDown");
      const menu = page.getByRole("listbox");
      await expect(menu).toBeVisible();
      const box = await menu.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `test-results/select-${width}.png` });
      await page.keyboard.press("End");
      await expect(
        page.getByRole("option", { name: "По остатку", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(select).toContainText("По остатку");
      await expect(select).toBeFocused();
      await expect(page.locator("tbody tr").first()).toContainText("63 шт.");
      await page.keyboard.press("Space");
      await expect(
        page.getByRole("option", { name: "По остатку", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Home");
      await expect(
        page.getByRole("option", { name: "По умолчанию", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(select).toContainText("По остатку");
      await expect(select).toBeFocused();
      await select.click();
      await expect(
        page.getByRole("option", { name: "По остатку", exact: true }),
      ).toBeFocused();
      await page.mouse.move(8, 200, { steps: 10 });
      await page.mouse.click(8, 200, { delay: 100 });
      await expect(menu).not.toBeVisible();
      await select.click();
      await expect(
        page.getByRole("option", { name: "По остатку", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Home");
      await expect(
        page.getByRole("option", { name: "По умолчанию", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(select).toContainText("По умолчанию");
    });
  });
}
