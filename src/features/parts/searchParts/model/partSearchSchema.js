import { z } from "zod";
export const partSearchSchema = z.object({
  number: z
    .string()
    .trim()
    .min(1, "Введите артикул детали.")
    .max(80, "Максимум 80 символов."),
});
