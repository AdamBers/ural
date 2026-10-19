import { test, expect } from "@playwright/test";
import path from "node:path";
test.use({
  launchOptions: {
    args: [
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
    ],
  },
});

test("фото распознаётся локально, поиск только после подтверждения", async ({
  page,
}) => {
  test.setTimeout(90000);
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("**/api/search**", (route) =>
    route.fulfill({ json: { brands: [] } }),
  );
  await page.goto("/");
  expect(requests.some((url) => url.includes("/ocr/"))).toBe(false);
  await page
    .getByLabel("Выбрать фото артикула", { exact: true })
    .setInputFiles(path.resolve("tests/fixtures/article.png"));
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Использовать артикул" }),
  ).toBeVisible({ timeout: 60000 });
  await expect(dialog.getByLabel("Артикул для поиска")).toHaveValue(
    /W\s*914\/2/i,
  );
  await expect(page.getByLabel("Артикул детали", { exact: true })).toHaveValue(
    "",
  );
  expect(requests.some((url) => url.includes("/api/search"))).toBe(false);
  expect(requests.some((url) => url.includes("/ocr/"))).toBe(true);
  expect(
    requests.every((url) => new URL(url).origin === "http://127.0.0.1:5180"),
  ).toBe(true);
  await dialog.getByLabel("Артикул для поиска").fill("01089");
  await dialog.getByRole("button", { name: "Использовать артикул" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByLabel("Артикул детали", { exact: true })).toHaveValue(
    "01089",
  );
  await expect
    .poll(() => requests.some((url) => url.includes("number=01089")))
    .toBe(true);
});

test("отказ камеры и неверный формат позволяют выбрать другое фото", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.cameraCalls = 0;
    navigator.mediaDevices.getUserMedia = async () => {
      window.cameraCalls++;
      throw new DOMException("Denied", "NotAllowedError");
    };
  });
  await page.goto("/");
  expect(await page.evaluate(() => window.cameraCalls)).toBe(0);
  await page.getByRole("button", { name: "Камера", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Доступ к камере запрещён",
  );
  await page.getByLabel("Другое фото артикула").setInputFiles({
    name: "bad.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from("<svg/>"),
  });
  await expect(page.getByRole("alert")).toContainText("JPG, PNG или WebP");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test.describe("камера на мобильном экране", () => {
  test.use({ viewport: { width: 390, height: 844 }, permissions: ["camera"] });
  test("снимок и закрытие останавливают видеопоток", async ({ page }) => {
    await page.addInitScript(() => {
      const original = navigator.mediaDevices.getUserMedia.bind(
        navigator.mediaDevices,
      );
      window.cameraTracks = [];
      navigator.mediaDevices.getUserMedia = async (...args) => {
        const stream = await original(...args);
        window.cameraTracks.push(...stream.getTracks());
        return stream;
      };
    });
    await page.goto("/");
    for (const capture of [false, true]) {
      await page.getByRole("button", { name: "Камера", exact: true }).click();
      const dialog = page.getByRole("dialog");
      await expect(
        dialog.getByRole("button", { name: "Сделать снимок" }),
      ).toBeEnabled();
      expect(
        await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      if (capture) {
        await dialog.getByRole("button", { name: "Сделать снимок" }).click();
        await expect(
          dialog.getByAltText("Выбранное фото артикула"),
        ).toBeVisible();
      }
      await dialog
        .getByRole("button", { name: "Закрыть распознавание" })
        .click();
      await expect
        .poll(() =>
          page.evaluate(() =>
            window.cameraTracks.every((track) => track.readyState === "ended"),
          ),
        )
        .toBe(true);
    }
  });
});
