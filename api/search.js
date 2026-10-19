import express from "express";
import { createSearchHandler } from "#server/api.js";
const app = express();
app.disable("x-powered-by");
app.get(/.*/, createSearchHandler({ apiKey: process.env.FAVORIT_API_KEY }));
export default app;
