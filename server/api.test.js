import { it, expect, vi } from "vitest";
import { EventEmitter } from "node:events";
import { createSearchHandler, parseGoods } from "./api.js";
const response = () => {
  const res = Object.assign(new EventEmitter(), {
    set: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
  });
  res.status.mockReturnValue(res);
  return res;
};
it("обрабатывает documented пустой ответ", () =>
  expect(parseGoods({ goods: [{}] })).toEqual([]));
it("отклоняет ошибку API и некорректный контракт", () => {
  expect(() => parseGoods({ error: "Invalid key client!" })).toThrow();
  expect(() => parseGoods({ goods: [{ brand: "B" }] })).toThrow();
});
it("не делает сетевой запрос без ключа", async () => {
  const request = vi.fn();
  const res = response();
  await createSearchHandler({ request })(
    { query: { number: "A", mode: "live" } },
    res,
  );
  expect(res.status).toHaveBeenCalledWith(503);
  expect(request).not.toHaveBeenCalled();
});
it("передаёт бренд и analogues=on только на втором этапе", async () => {
  const request = vi.fn().mockResolvedValue({ data: { goods: [] } });
  const handler = createSearchHandler({ request, apiKey: "test-secret" });
  await handler({ query: { number: "A&B", mode: "live" } }, response());
  expect(request.mock.calls[0][1].params).toEqual({
    key: "test-secret",
    number: "A&B",
    info: "on",
  });
  await handler(
    { query: { number: "A&B", brand: "MANN", mode: "live" } },
    response(),
  );
  expect(request.mock.calls[1][1].params).toMatchObject({
    brand: "MANN",
    analogues: "on",
  });
});
it("не раскрывает ключ при ошибке внешнего запроса", async () => {
  const res = response();
  await createSearchHandler({
    apiKey: "secret",
    request: vi.fn().mockRejectedValue(new Error("https://api/?key=secret")),
  })({ query: { number: "A", mode: "live" } }, res);
  expect(res.status).toHaveBeenCalledWith(502);
  expect(JSON.stringify(res.json.mock.calls)).not.toContain("secret");
});
it("проверяет входные данные до запроса", async () => {
  const res = response();
  await createSearchHandler()({ query: { number: "", mode: "demo" } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
});
it("проверяет вложенные аналоги и склады в формате документации", () => {
  const goods = [
    {
      goodsID: "1",
      brand: "MEYLE",
      number: "7160500039S",
      name: "Рычаг подвески",
      warehouses: [
        { id: "2", code: "МС2", own: false, price: 12533.62, stock: 20 },
      ],
      analogues: [{ brand: "Mapco", number: "53612/1", warehouses: [] }],
    },
  ];
  expect(parseGoods({ goods })[0]).toMatchObject({
    brand: "MEYLE",
    analogues: [{ brand: "Mapco" }],
    warehouses: [{ price: 12533.62 }],
  });
});

it("отменяет upstream-запрос при отключении клиента и не пишет ответ в закрытый сокет", async () => {
  const request = vi.fn(
    (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new Error("cancelled")), {
          once: true,
        });
      }),
  );
  const res = response();
  const pending = createSearchHandler({ request, apiKey: "test-key" })(
    { query: { number: "A" } },
    res,
  );
  const signal = request.mock.calls[0][1].signal;
  expect(signal.aborted).toBe(false);
  res.emit("close");
  await pending;
  expect(signal.aborted).toBe(true);
  expect(res.json).not.toHaveBeenCalled();
  expect(res.listenerCount("close")).toBe(0);
});
