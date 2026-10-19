import { test, expect } from "@playwright/test";
import { getDemoGoods } from "#src/entities/parts/demo.js";
test.beforeEach(async ({ page }) => {
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
});
test("поиск, бренд, предложения, фильтр и сброс", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "W 914/2", exact: true }).click();
  const brand = page.getByRole("button", { name: /MANN-FILTER/ });
  await expect(brand).toBeVisible();
  await brand.click();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(9);
  await page.getByLabel("Только в наличии").check();
  await expect(page.getByRole("row")).toHaveCount(8);
  await page.getByLabel("Сортировка предложений").selectOption("price");
  await expect(page.locator("tbody tr").first()).toContainText("FILTRON");
  await page.getByRole("button", { name: "Очистить артикул" }).click();
  await expect(page.getByRole("table")).toHaveCount(0);
  await expect(page.getByText("Начните с артикула")).toBeVisible();
});
test("пустой ответ и отсутствие ключа", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Артикул детали", { exact: true }).fill("empty");
  await expect(
    page.getByText("Артикул не найден", { exact: true }),
  ).toBeVisible();
  await page.route("**/api/search*mode=live*", (route) =>
    route.fulfill({
      status: 503,
      json: { message: "Ключ API ещё не подключён" },
    }),
  );
  await page.getByLabel("Артикул детали", { exact: true }).fill("W 914/2");
  await expect(page.getByRole("alert")).toContainText(
    "Ключ API ещё не подключён",
  );
  await expect(
    page.getByText("Поиск в каталоге Favorit-parts", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Посмотреть демо" }).click();
  await expect(
    page.getByText("Демо · учебные данные", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /MANN-FILTER/ })).toBeVisible();
  await page.getByRole("button", { name: "Вернуться к каталогу" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Ключ API ещё не подключён",
  );
});
test("мобильная компоновка", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "W 914/2", exact: true }).click();
  await page.getByRole("button", { name: /MANN-FILTER/ }).click();
  await expect(page.getByRole("table")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});
test("ошибка сети и повторный запрос", async ({ page }) => {
  await page.route("**/api/search*", (route) => route.abort("failed"), {
    times: 1,
  });
  await page.goto("/");
  await page.getByLabel("Артикул детали", { exact: true }).fill("W 914/2");
  await expect(page.getByRole("alert")).toContainText(
    "Не удалось загрузить данные",
  );
  await page.getByRole("button", { name: "Попробовать снова" }).click();
  await expect(page.getByRole("button", { name: /MANN-FILTER/ })).toBeVisible();
});

test("по умолчанию отправляет реальный запрос, демо включается только явно", async ({
  page,
}) => {
  const modes = [];
  await page.route("**/api/search*", (route) => {
    const url = new URL(route.request().url());
    modes.push(url.searchParams.get("mode"));
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
  await expect(
    page.getByText("Поиск в каталоге Favorit-parts", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "W 914/2", exact: true }).click();
  await expect(page.getByRole("button", { name: /MANN-FILTER/ })).toBeVisible();
  expect(modes).toEqual(["live"]);
  await page.getByRole("button", { name: "Посмотреть демо" }).click();
  await expect(page.getByRole("button", { name: /MANN-FILTER/ })).toBeVisible();
  expect(modes).toEqual(["live", "demo"]);
});
