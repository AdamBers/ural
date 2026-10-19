import { test, expect } from "@playwright/test";
import { getDemoGoods } from "#src/entities/parts/demo.js";
// Playwright normally hides native scrollbars, masking scroll-lock compensation bugs.
test.use({
  launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] },
  reducedMotion: "reduce",
});
for (const width of [390, 768, 1440, 1920]) {
  test(`открытие и закрытие селекта не сдвигает страницу ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
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
    await select.scrollIntoViewIfNeeded();
    await expect(page.locator("tbody tr")).toHaveCount(8);
    expect(
      await page.evaluate(
        () => innerWidth - document.documentElement.clientWidth,
      ),
    ).toBeGreaterThan(0);
    const geometry = () =>
      page.evaluate(() => {
        const rect = (selector) => {
          const { x, y, width, height } = document
            .querySelector(selector)
            .getBoundingClientRect();
          return { x, y, width, height };
        };
        return {
          header: rect("header"),
          main: rect("main"),
          search: rect("#part-search"),
          select: rect('[role="combobox"]'),
          bodyWidth: document.body.getBoundingClientRect().width,
          scrollY,
        };
      });
    const before = await geometry();
    for (let attempt = 0; attempt < 3; attempt++) {
      await select.click();
      await expect(page.getByRole("listbox")).toBeVisible();
      await expect(page.locator("body")).toHaveAttribute("data-scroll-locked");
      expect(await geometry()).toEqual(before);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("listbox")).not.toBeVisible();
      await expect(page.locator("body")).not.toHaveAttribute(
        "data-scroll-locked",
      );
      expect(await geometry()).toEqual(before);
    }
  });
}
