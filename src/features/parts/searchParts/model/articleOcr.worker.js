import { createWorker, PSM } from "tesseract.js";
self.onmessage = async ({ data: { image, base } }) => {
  let worker;
  const reportError = (error) =>
    self.postMessage({
      type: "error",
      message: error?.message || String(error),
    });
  try {
    worker = await createWorker("eng", 1, {
      workerPath: `${base}/worker.min.js`,
      corePath: `${base}/core`,
      langPath: `${base}/lang`,
      workerBlobURL: false,
      errorHandler: reportError,
      logger: (message) =>
        self.postMessage({
          type: "progress",
          progress:
            message.status === "recognizing text"
              ? Math.round(20 + message.progress * 80)
              : Math.round((message.progress || 0) * 15),
        }),
    });
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      preserve_interword_spaces: "1",
      user_defined_dpi: "300",
    });
    const { data } = await worker.recognize(image);
    self.postMessage({ type: "result", text: data.text });
  } catch (error) {
    reportError(error);
  } finally {
    await worker?.terminate().catch(() => {});
  }
};
