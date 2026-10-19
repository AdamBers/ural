import { ImageSquareIcon } from "@phosphor-icons/react/dist/csr/ImageSquare";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { useEffect, useId, useRef } from "react";

import { useArticlePhoto } from "@/features/parts/searchParts/model/useArticlePhoto.js";
import ArticlePhotoResult from "@/features/parts/searchParts/ui/ArticlePhotoResult.jsx";
import ArticleCameraCapture from "@/features/parts/searchParts/ui/ArticleCameraCapture.jsx";
import styles from "./ArticlePhotoDialog.module.scss";
function ArticlePhotoDialog({
  initialFile,
  startWithCamera,
  onClose,
  onConfirm,
}) {
  const dialog = useRef(null);
  const picker = useRef(null);
  const titleId = useId();
  const { camera, preview, reading, progress, result, error, chooseFile } =
    useArticlePhoto(initialFile, startWithCamera);
  useEffect(() => {
    const node = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className={styles.header}>
        <div>
          <h2 id={titleId}>{camera ? "Камера" : "Артикул с фотографии"}</h2>
          <p>Фото обрабатывается на устройстве и не отправляется на сервер.</p>
        </div>
        <button
          type="button"
          className={styles.close}
          aria-label="Закрыть распознавание"
          onClick={onClose}
        >
          <XIcon weight="regular" size={21} />
        </button>
      </header>
      <div className={styles.body}>
        {camera ? (
          <ArticleCameraCapture onCapture={chooseFile} />
        ) : (
          <>
            {preview && (
              <img
                className={styles.preview}
                src={preview}
                alt="Выбранное фото артикула"
              />
            )}
            <ArticlePhotoResult
              reading={reading}
              progress={progress}
              result={result}
              error={error}
              onConfirm={onConfirm}
            />
          </>
        )}
      </div>
      <footer className={styles.footer}>
        <div>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => picker.current.click()}
          >
            <ImageSquareIcon size={16} />
            {preview ? "Другое фото" : "Выбрать фото"}
          </button>
          <span>JPG, PNG, WebP · до 10 МБ</span>
        </div>
        <button type="button" className={styles.secondary} onClick={onClose}>
          Отмена
        </button>
      </footer>
      <input
        hidden
        ref={picker}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Другое фото артикула"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) chooseFile(file);
        }}
      />
    </dialog>
  );
}
export default ArticlePhotoDialog;
