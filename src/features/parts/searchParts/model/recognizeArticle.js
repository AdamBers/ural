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
  let startup;
  let rejectAborted;
  let timedOut = false;
  const terminate = () => {
    if (worker) void worker.terminate().catch(() => {});
    else if (startup)
      void startup.then((value) => value.terminate()).catch(() => {});
  };
  const abort = () => {
    terminate();
    rejectAborted?.(new DOMException("Распознавание отменено.", "AbortError"));
  };
  const aborted = new Promise((_, reject) => {
    rejectAborted = reject;
  });
  // Prevent an unhandled rejection when cancellation happens during image decoding.
  void aborted.catch(() => {});
  signal.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(() => {
    timedOut = true;
    terminate();
    rejectAborted(
      new Error(
        "Не удалось распознать фото за минуту. Попробуйте более чёткий снимок.",
      ),
    );
  }, 60000);
  try {
    signal.throwIfAborted();
    const image = await prepareImage(file);
    signal.throwIfAborted();
    const { createWorker, PSM } = await import("tesseract.js");
    signal.throwIfAborted();
    if (timedOut)
      throw new Error(
        "Не удалось распознать фото за минуту. Попробуйте более чёткий снимок.",
      );
    const base = `${location.origin}/ocr`;
    startup = createWorker("eng", 1, {
      workerPath: `${base}/worker.min.js`,
      corePath: `${base}/core`,
      langPath: `${base}/lang`,
      workerBlobURL: false,
      logger: (message) => {
        if (!signal.aborted && !timedOut)
          onProgress(
            message.status === "recognizing text"
              ? Math.round(20 + message.progress * 80)
              : Math.round((message.progress || 0) * 15),
          );
      },
    });
    worker = await Promise.race([startup, aborted]);
    signal.throwIfAborted();
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      preserve_interword_spaces: "1",
      user_defined_dpi: "300",
    });
    const { data } = await Promise.race([worker.recognize(image), aborted]);
    signal.throwIfAborted();
    return { text: data.text, candidates: extractArticleCandidates(data.text) };
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
    if (worker) await worker.terminate().catch(() => {});
  }
}
