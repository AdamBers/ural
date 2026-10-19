import { Camera } from "lucide-react";
import { useArticleCamera } from "@/features/parts/searchParts/model/useArticleCamera.js";
import styles from "./ArticlePhotoDialog.module.scss";
function ArticleCameraCapture({ onCapture }) {
  const { videoRef, status, error, capture } = useArticleCamera(onCapture);
  return (
    <div>
      <div className={styles.cameraFrame}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          aria-label="Предпросмотр камеры"
        />
        {status === "loading" && (
          <span className={styles.cameraStatus} role="status">
            Подключаем камеру…
          </span>
        )}
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <p className={styles.hint}>
        Расположите номер крупно в кадре. Избегайте бликов и размытия.
      </p>
      <button
        type="button"
        className={styles.primary}
        onClick={capture}
        disabled={status !== "ready"}
      >
        <Camera size={17} />
        Сделать снимок
      </button>
    </div>
  );
}
export default ArticleCameraCapture;
