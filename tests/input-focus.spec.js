import { test, expect } from "@playwright/test";
for (const viewport of [
  { width: 1280, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
]) {
  test.describe(`input focus ${viewport.width}px`, () => {
    test.use({ viewport });
    test("одна внешняя подсветка мышью и клавиатурой без сдвига поля", async ({
      page,
    }) => {
      await page.goto("/");
      const input = page.getByLabel("Артикул детали", { exact: true });
      const container = input.locator("..");
      const before = await container.boundingBox();
      const unfocusedBorder = await container.evaluate(
        (element) => getComputedStyle(element).borderColor,
      );
      for (let step = 0; step < 12; step++) {
        await page.keyboard.press("Tab");
        if (
          await input.evaluate((element) => element === document.activeElement)
        )
          break;
      }
      await expect(input).toBeFocused();
      const checkFocus = async () => {
        expect(
          await input.evaluate((element) => ({
            outline: getComputedStyle(element).outlineStyle,
            shadow: getComputedStyle(element).boxShadow,
          })),
        ).toEqual({ outline: "none", shadow: "none" });
        const outer = await container.evaluate((element) => ({
          border: getComputedStyle(element).borderColor,
          shadow: getComputedStyle(element).boxShadow,
          radius: getComputedStyle(element).borderRadius,
        }));
        expect(outer.border).not.toBe(unfocusedBorder);
        expect(outer.shadow).not.toBe("none");
        expect(outer.radius).not.toBe("0px");
        expect(await container.boundingBox()).toEqual(before);
      };
      await checkFocus();
      await page.keyboard.press("Tab");
      const example = page.getByRole("button", {
        name: "W 914/2",
        exact: true,
      });
      await expect(example).toBeFocused();
      expect(
        await example.evaluate(
          (element) => getComputedStyle(element).outlineStyle,
        ),
      ).toBe("solid");
      await input.click();
      await expect(input).toBeFocused();
      await checkFocus();
      const box = await container.boundingBox();
      await page.screenshot({
        path: `test-results/input-focus-${viewport.width}.png`,
        clip: {
          x: Math.max(0, box.x - 8),
          y: Math.max(0, box.y - 30),
          width: box.width + 16,
          height: box.height + 42,
        },
      });
    });
  });
}
