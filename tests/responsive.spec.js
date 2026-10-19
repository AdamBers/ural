import { test, expect } from "@playwright/test";
import { getDemoGoods } from "#src/entities/parts/demo.js";

const devices = [
  { width: 320, height: 740 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 480, height: 800 },
  { width: 600, height: 900 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];
for (const viewport of devices) {
  test.describe(`responsive ${viewport.width}px`, () => {
    test.use({
      viewport,
      isMobile: viewport.width <= 1024,
      hasTouch: viewport.width <= 1024,
    });
    test("поиск, длинные строки, цены и управление помещаются на экране", async ({
      page,
    }) => {
      await page.route("**/api/search*", async (route) => {
        const url = new URL(route.request().url());
        const goods = getDemoGoods("W 914/2", url.searchParams.get("brand"));
        if (url.searchParams.has("brand")) {
          goods[0].name = "Очень длинное название детали " + "X".repeat(120);
          goods[0].warehouses[0].price = 1234567.89;
          goods[0].number = "A".repeat(80);
        }
        await route.fulfill({ json: { goods } });
      });
      await page.goto("/");
      await page.getByRole("button", { name: "W 914/2", exact: true }).click();
      await page.getByRole("button", { name: /MANN-FILTER/ }).click();
      await expect(page.getByRole("table")).toBeVisible();
      const scrollArea = page.getByTestId("offers-scroll");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await scrollArea.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      const price = page.getByTestId("offer-price").first();
      const bounds = await price.boundingBox();
      const area = await scrollArea.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(area.x);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(area.x + area.width);
      await page.getByLabel("Только в наличии").check();
      await page.getByLabel("Сортировка предложений").selectOption("price");
      await expect(page.locator("tbody tr").first()).toContainText("FILTRON");
      await expect(
        page.getByRole("button", { name: "Следующая страница" }),
      ).toBeVisible();
      await page.evaluate(() =>
        window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
      );
      await page.screenshot({
        path: `test-results/responsive-${viewport.width}.png`,
        fullPage: true,
      });
    });
  });
}
