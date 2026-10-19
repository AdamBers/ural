import { useEffect, useState } from "react";
import { photoFileSchema } from "@/features/parts/searchParts/model/articlePhotoSchema.js";
export function useArticlePhoto(initialFile, startWithCamera) {
  const [file, setFile] = useState(initialFile || null);
  const [camera, setCamera] = useState(startWithCamera);
  const [preview, setPreview] = useState("");
  const [reading, setReading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const chooseFile = (value) => {
    setCamera(false);
    setFile(value);
  };
  useEffect(() => {
    if (!file) return;
    const validation = photoFileSchema.safeParse(file);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setResult(null);
      setPreview("");
      setReading(false);
      return;
    }
    let active = true;
    const controller = new AbortController();
    const url = URL.createObjectURL(file);
    setPreview(url);
    setReading(true);
    setProgress(0);
    setResult(null);
    setError("");
    void import("@/features/parts/searchParts/model/recognizeArticle.js")
      .then(({ recognizeArticle }) =>
        recognizeArticle(file, {
          signal: controller.signal,
          onProgress: (value) => {
            if (active) setProgress((previous) => Math.max(previous, value));
          },
        }),
      )
      .then((value) => {
        if (active) {
          setResult(value);
          if (!value.candidates.length)
            setError(
              "Артикул не найден на фото. Введите его вручную или выберите другой снимок.",
            );
        }
      })
      .catch((value) => {
        if (active && value.name !== "AbortError")
          setError(
            value.message?.startsWith("Фото слишком") ||
              value.message?.includes("за минуту")
              ? value.message
              : "Не удалось прочитать фото. Снимите артикул крупнее и без бликов или введите его вручную.",
          );
      })
      .finally(() => {
        if (active) setReading(false);
      });
    return () => {
      active = false;
      controller.abort();
      URL.revokeObjectURL(url);
    };
  }, [file]);
  return { camera, preview, reading, progress, result, error, chooseFile };
}
