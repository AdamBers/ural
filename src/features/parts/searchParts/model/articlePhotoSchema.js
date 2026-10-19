import { z } from "zod";
export const photoFileSchema = z
  .file()
  .mime(
    ["image/jpeg", "image/png", "image/webp"],
    "Выберите фото JPG, PNG или WebP.",
  )
  .min(1, "Выберите непустой файл.")
  .max(10 * 1024 * 1024, "Размер фото не должен превышать 10 МБ.");
export const articleConfirmationSchema = z.object({
  number: z
    .string()
    .trim()
    .min(1, "Введите или выберите артикул.")
    .max(80, "Артикул должен быть не длиннее 80 символов."),
});
