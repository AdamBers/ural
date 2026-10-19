import express from "express";
import compression from "compression";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createSearchHandler } from "./api.js";
const app = express();
app.disable("x-powered-by");
app.use(compression());
app.get(
  "/api/search",
  createSearchHandler({ apiKey: process.env.FAVORIT_API_KEY }),
);
app.get("/api/health", (_req, res) => res.json({ ok: true }));
const dist = fileURLToPath(new URL("../dist", import.meta.url));
app.use(express.static(dist));
app.get("/", (_req, res) => res.sendFile(resolve(dist, "index.html")));
app.listen(Number(process.env.PORT || 3001), "127.0.0.1", (error) => {
  if (error) {
    console.error("Не удалось запустить сервер: проверьте доступность порта.");
    process.exitCode = 1;
    return;
  }
  console.log(`API и production: http://127.0.0.1:${process.env.PORT || 3001}`);
});
