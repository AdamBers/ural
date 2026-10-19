import { useId } from "react";
import { LoaderCircle } from "lucide-react";
import { useArticleConfirmation } from "@/features/parts/searchParts/model/useArticleConfirmation.js";
import styles from "./ArticlePhotoDialog.module.scss";
function ArticlePhotoResult({ reading, progress, result, error, onConfirm }) {
  const inputId = useId();
  const { register, errors, submit, pick } = useArticleConfirmation(
    result,
    onConfirm,
  );
  if (reading)
    return (
      <div className={styles.reading} role="status">
        <LoaderCircle className={styles.spin} size={21} />
        <strong>Распознаём артикул…</strong>
        <progress
          value={progress}
          max={100}
          aria-label="Распознавание артикула"
        />
        <span>
          При первом запуске подготовка может занять несколько секунд.
        </span>
      </div>
    );
  return (
    <>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <form className={styles.form} onSubmit={submit}>
        <p className={styles.hint}>
          Проверьте буквы и цифры перед поиском: например, 0 и O, 1 и I.
        </p>
        {!!result?.candidates.length && (
          <div
            className={styles.candidates}
            role="group"
            aria-label="Варианты распознанного артикула"
          >
            {result.candidates.map((value) => (
              <button type="button" key={value} onClick={() => pick(value)}>
                {value}
              </button>
            ))}
          </div>
        )}
        <label htmlFor={inputId}>Артикул для поиска</label>
        <input
          id={inputId}
          {...register("number")}
          maxLength={80}
          autoComplete="off"
          aria-invalid={!!errors.number}
        />
        {errors.number && (
          <p className={styles.error} role="alert">
            {errors.number.message}
          </p>
        )}
        {result?.text && (
          <details className={styles.rawText}>
            <summary>Весь распознанный текст</summary>
            <pre>{result.text}</pre>
          </details>
        )}
        <button className={styles.primary} type="submit">
          Использовать артикул
        </button>
      </form>
    </>
  );
}
export default ArticlePhotoResult;
