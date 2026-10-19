import styles from "./OffersPagination.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
function OffersPagination({ page, pages, total, pageSize, onPageChange }) {
  return (
    <div className={styles.offersPagination}>
      <span aria-live="polite">
        {total ? page * pageSize + 1 : 0}–
        {Math.min((page + 1) * pageSize, total)} из {total}
      </span>
      <div>
        <button
          className={styles.pageButton}
          aria-label="Предыдущая страница"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        <span>
          Страница {page + 1} из {Math.max(1, pages)}
        </span>
        <button
          className={styles.pageButton}
          aria-label="Следующая страница"
          disabled={page + 1 >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
export default OffersPagination;
