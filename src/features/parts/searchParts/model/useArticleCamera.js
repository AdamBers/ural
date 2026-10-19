import { useEffect, useRef, useState } from "react";
export function useArticleCamera(onCapture) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const activeRef = useRef(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const stop = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };
  useEffect(() => {
    let active = true;
    activeRef.current = true;
    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setError(
          "Камера доступна через HTTPS или localhost. Вы также можете выбрать готовое фото.",
        );
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        if (active) setStatus("ready");
      } catch (value) {
        if (active) {
          stop();
          setStatus("error");
          setError(
            value.name === "NotAllowedError"
              ? "Доступ к камере запрещён. Разрешите его в браузере или выберите готовое фото."
              : value.name === "NotFoundError"
                ? "Камера не найдена. Выберите готовое фото."
                : "Не удалось включить камеру. Возможно, она занята другим приложением. Выберите фото или попробуйте ещё раз.",
          );
        }
      }
    };
    void start();
    return () => {
      active = false;
      activeRef.current = false;
      stop();
    };
  }, []);
  const capture = async () => {
    const video = videoRef.current;
    if (!video?.videoWidth || status !== "ready") return;
    setStatus("capturing");
    const scale = Math.min(1, 2400 / video.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92),
    );
    if (!activeRef.current) return;
    if (!blob) {
      setStatus("ready");
      setError("Не удалось сделать снимок. Выберите готовое фото.");
      return;
    }
    stop();
    onCapture(new File([blob], "article-camera.jpg", { type: "image/jpeg" }));
  };
  return { videoRef, status, error, capture };
}
