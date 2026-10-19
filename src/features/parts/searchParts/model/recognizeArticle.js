import { extractArticleCandidates } from "@/features/parts/searchParts/model/articleCandidates.js";
async function prepareImage(file) {
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 32_000_000)
      throw new Error(
        "Фото слишком большое по разрешению. Выберите снимок до 32 мегапикселей.",
      );
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    bitmap.close();
  }
}
export async function recognizeArticle(file, { signal, onProgress }) {
  let worker;
  let rejectCancelled;
  const cancelled = new Promise((_, reject) => {
    rejectCancelled = reject;
  });
  void cancelled.catch(() => {});
  const abort = () =>
    rejectCancelled(new DOMException("Распознавание отменено.", "AbortError"));
  signal.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(
    () =>
      rejectCancelled(
        new Error(
          "Не удалось распознать фото за минуту. Попробуйте более чёткий снимок.",
        ),
      ),
    60000,
  );
  try {
    signal.throwIfAborted();
    const canvas = await Promise.race([prepareImage(file), cancelled]);
    const image = await Promise.race([
      new Promise((resolve, reject) =>
        canvas.toBlob(
          (blob) =>
            blob
              ? resolve(blob)
              : reject(new Error("Не удалось подготовить фото.")),
          "image/png",
        ),
      ),
      cancelled,
    ]);
    signal.throwIfAborted();
    // Own the supervisor immediately, so cancellation also stops SDK initialization.
    worker = new Worker(new URL("./articleOcr.worker.js", import.meta.url), {
      type: "module",
    });
    const result = new Promise((resolve, reject) => {
      worker.onmessage = ({ data }) => {
        if (data.type === "progress") onProgress(data.progress);
        else if (data.type === "result") resolve(data.text);
        else if (data.type === "error") reject(new Error(data.message));
      };
      worker.onerror = (event) => {
        event.preventDefault();
        reject(new Error("Не удалось запустить распознавание."));
      };
      worker.postMessage({ image, base: `${location.origin}/ocr` });
    });
    const text = await Promise.race([result, cancelled]);
    signal.throwIfAborted();
    return { text, candidates: extractArticleCandidates(text) };
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
    // Terminating the supervisor also terminates the nested Tesseract worker.
    worker?.terminate();
  }
}
