import axios from "axios";
import { z } from "zod";
import { getDemoGoods } from "#src/entities/parts/demo.js";
const warehouseSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  code: z.string().optional(),
  own: z.boolean().optional(),
  price: z.number().nonnegative().nullish(),
  stock: z.number().nonnegative().nullish(),
  notRefund: z.boolean().optional(),
});
const goodSchema = z.object({
  goodsID: z.string().optional(),
  brand: z.string().min(1),
  number: z.string().min(1),
  name: z.string().optional(),
  notRefund: z.boolean().optional(),
  warehouses: z.array(warehouseSchema).nullish(),
  get analogues() {
    return z.array(goodSchema).nullish();
  },
});
const querySchema = z.object({
  number: z.string().trim().min(1).max(80),
  brand: z.string().trim().min(1).max(100).optional(),
  mode: z.enum(["demo", "live"]).default("live"),
});
export function parseGoods(data) {
  if (data?.error) throw new Error("UPSTREAM_ERROR");
  const goods = Array.isArray(data) ? data : data?.goods;
  if (!Array.isArray(goods)) throw new Error("INVALID_RESPONSE");
  return goods
    .filter((item) => item && Object.keys(item).length > 0)
    .map((item) => goodSchema.parse(item));
}
export function createSearchHandler({
  apiKey = "",
  request = axios.get,
  demoDelay = 450,
} = {}) {
  return async (req, res) => {
    res.set("Cache-Control", "no-store");
    const result = querySchema.safeParse(req.query);
    if (!result.success)
      return res.status(400).json({
        message:
          "Укажите артикул длиной от 1 до 80 символов и корректный режим поиска.",
      });
    const { number, brand, mode } = result.data;
    if (mode === "demo") {
      await new Promise((resolve) => setTimeout(resolve, demoDelay));
      return res.json({ goods: getDemoGoods(number, brand) });
    }
    if (!apiKey)
      return res.status(503).json({
        message:
          "Ключ API ещё не подключён. Добавьте FAVORIT_API_KEY в .env на сервере или вернитесь в деморежим.",
      });
    try {
      const { data } = await request(
        "https://api.favorit-parts.ru/hs/hsprice/",
        {
          params: {
            key: apiKey,
            number,
            ...(brand ? { brand, analogues: "on" } : {}),
            info: "on",
          },
          timeout: 20000,
          maxRedirects: 0,
          maxContentLength: 5 * 1024 * 1024,
        },
      );
      return res.json({ goods: parseGoods(data) });
    } catch (error) {
      const timeout = error.code === "ECONNABORTED";
      return res.status(timeout ? 504 : 502).json({
        message: timeout
          ? "API не ответил вовремя. Повторите запрос позже."
          : "Не удалось получить ответ Favorit-parts. Проверьте ключ, доступность API и лимит запросов.",
      });
    }
  };
}
