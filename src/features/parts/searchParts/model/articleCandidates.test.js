import { describe, expect, it } from "vitest";
import { extractArticleCandidates } from "@/features/parts/searchParts/model/articleCandidates.js";
import {
  photoFileSchema,
  articleConfirmationSchema,
} from "@/features/parts/searchParts/model/articlePhotoSchema.js";
describe("артикул на фото", () => {
  it("убирает подписи, сохраняет ведущие нули и неоднозначные буквы", () => {
    expect(
      extractArticleCandidates(
        "PART NO: W 914/2\n01089\nNO123\nO0I1\nMANN FILTER\nW 914/2",
      ),
    ).toEqual(["W 914/2", "01089", "NO123", "O0I1"]);
  });
  it("ограничивает число вариантов и не принимает обычный текст", () => {
    expect(extractArticleCandidates("MANN FILTER\nMade in Germany")).toEqual(
      [],
    );
    expect(
      extractArticleCandidates(
        Array.from({ length: 20 }, (_, i) => `ABC${i}`).join("\n"),
      ),
    ).toHaveLength(8);
  });
  it("проверяет формат, пустой файл и лимит размера", () => {
    expect(
      photoFileSchema.safeParse(
        new File(["photo"], "article.png", { type: "image/png" }),
      ).success,
    ).toBe(true);
    expect(
      photoFileSchema.safeParse(
        new File(["svg"], "bad.svg", { type: "image/svg+xml" }),
      ).success,
    ).toBe(false);
    expect(
      photoFileSchema.safeParse(
        new File([], "empty.jpg", { type: "image/jpeg" }),
      ).success,
    ).toBe(false);
    expect(
      photoFileSchema.safeParse(
        new File([new Uint8Array(10 * 1024 * 1024 + 1)], "big.jpg", {
          type: "image/jpeg",
        }),
      ).success,
    ).toBe(false);
  });
  it("требует подтверждённый непустой артикул", () => {
    expect(articleConfirmationSchema.safeParse({ number: "  " }).success).toBe(
      false,
    );
    expect(articleConfirmationSchema.parse({ number: " 01089 " }).number).toBe(
      "01089",
    );
  });
});
