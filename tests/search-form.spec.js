import { test, expect } from "@playwright/test";
import { getDemoGoods } from "#src/entities/parts/demo.js";
test("debounce 500 мс после последнего ввода и Enter без повторного запроса", async ({
  page,
}) => {
  const requests = [];
  await page.route("**/api/search*", (route) => {
    const url = new URL(route.request().url());
    requests.push(url.searchParams.get("number"));
    return route.fulfill({
      json: {
        goods: getDemoGoods(
          url.searchParams.get("number"),
          url.searchParams.get("brand"),
        ),
      },
    });
  });
  await page.clock.install({ time: new Date("2026-10-19T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-10-19T00:00:10Z"));
  await page.goto("/");
  const input = page.getByLabel("Артикул детали", { exact: true });
  await input.fill("W 9");
  await page.clock.runFor(499);
  expect(requests).toEqual([]);
  await input.fill("W 914/2");
  await page.clock.runFor(499);
  expect(requests).toEqual([]);
  await page.clock.runFor(1);
  await expect.poll(() => requests).toEqual(["W 914/2"]);
  await input.press("Enter");
  await page.clock.runFor(1000);
  expect(requests).toEqual(["W 914/2"]);
  await input.fill("NEXT");
  await page.clock.runFor(250);
  await page.getByRole("button", { name: "Очистить артикул" }).click();
  await page.clock.runFor(1000);
  expect(requests).toEqual(["W 914/2"]);
  await expect(input).toHaveValue("");
});

test("Zod отклоняет пробелы, нормализует артикул и сбрасывает ошибку при очистке", async ({
  page,
}) => {
  const requests = [];
  await page.route("**/api/search*", (route) => {
    const url = new URL(route.request().url());
    requests.push(url.searchParams.get("number"));
    return route.fulfill({ json: { goods: [] } });
  });
  await page.clock.install({ time: new Date("2026-10-19T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-10-19T00:00:10Z"));
  await page.goto("/");
  const input = page.getByLabel("Артикул детали", { exact: true });
  await input.fill("   ");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#part-number-error")).toHaveText(
    "Введите артикул детали.",
  );
  await page.clock.runFor(1000);
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "Очистить артикул" }).click();
  await expect(input).toHaveAttribute("aria-invalid", "false");
  await expect(page.locator("#part-number-error")).toBeEmpty();
  await input.fill(" 01089 ");
  await page.clock.runFor(500);
  await expect.poll(() => requests).toEqual(["01089"]);
  await expect(input).toHaveAttribute("aria-invalid", "false");
});
