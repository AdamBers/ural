import { lazy, Suspense, useRef, useState } from "react";
import { ImagePlus, Camera } from "lucide-react";
import styles from "./ArticlePhotoInput.module.scss";
const ArticlePhotoDialog = lazy(
  () => import("@/features/parts/searchParts/ui/ArticlePhotoDialog.jsx"),
);
function ArticlePhotoInput({ onDetected }) {
  const fileInput = useRef(null);
  const [dialog, setDialog] = useState(null);
  return (
    <div className={styles.root}>
      <div
        className={styles.actions}
        role="group"
        aria-label="Найти артикул по фото"
      >
        <button type="button" onClick={() => fileInput.current.click()}>
          <ImagePlus size={16} />
          Загрузить фото
        </button>
        <button type="button" onClick={() => setDialog({ camera: true })}>
          <Camera size={16} />
          Камера
        </button>
      </div>
      <input
        hidden
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Выбрать фото артикула"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) setDialog({ file });
        }}
      />
      {dialog && (
        <Suspense
          fallback={
            <div className={styles.opening} role="status">
              Открываем окно распознавания…
            </div>
          }
        >
          <ArticlePhotoDialog
            initialFile={dialog.file}
            startWithCamera={!!dialog.camera}
            onClose={() => setDialog(null)}
            onConfirm={(number) => {
              setDialog(null);
              onDetected(number);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
export default ArticlePhotoInput;
