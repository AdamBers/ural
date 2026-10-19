import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { getDemoGoods } from "#src/entities/parts/demo.js";

const baseline = process.argv.includes("--baseline");
const port = baseline ? "5191" : "5192";
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["server/main.js"], {
  env: { ...process.env, PORT: port, FAVORIT_API_KEY: "" },
  stdio: "pipe",
});
let serverError = "";
server.stderr.on("data", (chunk) => {
  serverError += chunk;
});
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null)
      throw new Error(serverError || "Production server exited");
    try {
      ready = (await fetch(`${origin}/api/health`)).ok;
    } catch {
      /* Wait for our server. */
    }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error("Production server did not start");
  browser = await chromium.launch({
    ignoreDefaultArgs: ["--hide-scrollbars"],
  });
  const library = await readFile(
    new URL(
      "../node_modules/web-vitals/dist/web-vitals.iife.js",
      import.meta.url,
    ),
    "utf8",
  );
  const results = [];
  const stressGoods = Array.from({ length: 700 }, (_, i) => ({
    goodsID: `good-${i}`,
    brand: `BRAND-${i}`,
    number: `ABC-${i}`,
    name:
      "Комплект рычагов задней подвески для обеих сторон, усиленная конструкция " +
      "X".repeat(100),
    warehouses: Array.from({ length: 10 }, (_, j) => ({
      id: `warehouse-${j}`,
      code: "МСК РС",
      price: 500 + i + j,
      stock: j === 0 ? 0 : 5,
      own: true,
    })),
  }));
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 740 },
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 1_600_000 / 8,
      uploadThroughput: 750_000 / 8,
    });
    await page.addInitScript({
      content: `${library}\nwindow.__vitals = {}; window.__shifts = []; for (const key of ['CLS','LCP','INP']) webVitals['on'+key](metric => { window.__vitals[key] = metric.value; }, {reportAllChanges: true}); new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__shifts.push({value:entry.value, sources:entry.sources?.map(source=>source.node?.className || source.node?.nodeName)}); }).observe({type:'layout-shift', buffered:true});`,
    });
    await page.route("**/api/search*", async (route) => {
      const url = new URL(route.request().url());
      await new Promise((resolve) => setTimeout(resolve, 900));
      if (url.searchParams.get("number") === "error")
        return route.fulfill({
          status: 502,
          json: { message: "Тестовая ошибка API" },
        });
      const goods =
        url.searchParams.get("number") === "empty"
          ? []
          : url.searchParams.has("brand")
            ? stressGoods
            : getDemoGoods("W 914/2");
      await route.fulfill({ json: { goods } });
    });
    await page.goto(origin);
    await page.waitForTimeout(1400);
    const initial = await page.evaluate(() => ({ ...window.__vitals }));
    await page.getByRole("button", { name: "W 914/2", exact: true }).click();
    await page.getByRole("button", { name: /MANN-FILTER/ }).waitFor();
    await page.getByRole("button", { name: /MANN-FILTER/ }).click();
    await page.getByRole("table").waitFor();
    const rows = await page.locator("tbody tr").count();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    const tableOverflow = await page
      .getByTestId("offers-scroll")
      .evaluate((element) => element.scrollWidth > element.clientWidth);
    await page
      .getByRole("combobox", { name: "Сортировка предложений" })
      .click();
    await page
      .getByRole("option", { name: "Сначала дешевле", exact: true })
      .click();
    await page.getByLabel("Только в наличии").check();
    const next = page.getByRole("button", { name: "Следующая страница" });
    if (await next.count()) await next.click();
    await page.waitForTimeout(1200);
    await mkdir("test-results", { recursive: true });
    await page.screenshot({
      path: `test-results/vitals-${viewport.width}.png`,
    });
    await page.getByLabel("Артикул детали", { exact: true }).fill("empty");
    await page.getByText("Артикул не найден", { exact: true }).waitFor();
    await page.getByLabel("Артикул детали", { exact: true }).fill("error");
    await page.getByRole("alert").waitFor();
    await page.waitForTimeout(1200);
    const measurement = await page.evaluate(() => ({
      vitals: window.__vitals,
      shifts: window.__shifts.slice(0, 12),
    }));
    results.push({
      viewport,
      initial,
      ...measurement,
      rows,
      overflow,
      tableOverflow,
    });
    await context.close();
  }
  const report = {
    measuredAt: new Date().toISOString(),
    environment:
      "Local production build, Chromium with visible native scrollbars, CPU 4x slowdown, 1.6 Mbps / 150 ms RTT; delayed synthetic 7000 offers; cold browser contexts",
    limits: { LCP: 2500, INP: 200, CLS: 0.1 },
    note: "Laboratory interaction measurements, not field p75 or a PageSpeed score. Covers initial load, delayed brands/offers, sorting/filtering/pagination, empty and error states.",
    results,
  };
  await mkdir("docs", { recursive: true });
  await writeFile(
    `docs/vitals-${baseline ? "before" : "lab"}.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
  if (
    !baseline &&
    results.some(
      ({ vitals, rows, overflow, tableOverflow }) =>
        overflow ||
        tableOverflow ||
        rows > 50 ||
        !Number.isFinite(vitals.LCP) ||
        !Number.isFinite(vitals.INP) ||
        !Number.isFinite(vitals.CLS) ||
        vitals.CLS > 0.1 ||
        vitals.LCP > 2500 ||
        vitals.INP > 200,
    )
  )
    process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
