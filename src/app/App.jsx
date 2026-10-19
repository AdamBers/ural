import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { QuestionIcon } from "@phosphor-icons/react/dist/csr/Question";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { SquaresFourIcon } from "@phosphor-icons/react/dist/csr/SquaresFour";
import styles from "./App.module.scss";

import SearchPartsFeature from "@/features/parts/searchParts/SearchPartsFeature.jsx";
function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a
            href="/"
            className={styles.wordmark}
            aria-label="FAVORIT — главная"
          >
            FAVORIT<span className={styles.brandSuffix}>PARTS</span>
          </a>
          <a className={styles.currentPage} href="#part-search">
            <SquaresFourIcon size={15} />
            Каталог
          </a>
          <div className={styles.headerActions}>
            <a
              className={styles.helpLink}
              href="https://favorit-parts.ru/company/contacts/"
              target="_blank"
              rel="noreferrer"
              aria-label="Помощь"
            >
              <QuestionIcon size={18} />
              <span>Помощь</span>
            </a>
            <a
              className={styles.accountLink}
              href="https://lk.favorit-parts.ru/"
              target="_blank"
              rel="noreferrer"
            >
              <span>Личный кабинет</span>
              <ArrowUpRightIcon weight="regular" size={15} />
            </a>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.pageHeading}>
          <div>
            <div className={styles.eyebrow}>КАТАЛОГ АВТОЗАПЧАСТЕЙ</div>
            <h1>Подбор запчастей</h1>
          </div>
          <p>Производители, аналоги и предложения складов</p>
        </div>
        <SearchPartsFeature />
        <div className={styles.helper}>
          <span>
            <SquaresFourIcon size={15} />
            Сохраняйте буквы, цифры и разделители артикула.
          </span>
          <a
            href="https://favorit-parts.ru/company/contacts/"
            target="_blank"
            rel="noreferrer"
          >
            Помочь с поиском?
            <ArrowRightIcon weight="regular" size={14} />
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} ООО «ЮРАЛ»
          <span className={styles.footerDot}>·</span>FAVORIT
        </span>
        <div>
          <a href="https://favorit-parts.ru/" target="_blank" rel="noreferrer">
            Компания
            <ArrowUpRightIcon weight="regular" size={12} />
          </a>
          <a
            href="https://lk.favorit-parts.ru/static/wsprice.pdf"
            target="_blank"
            rel="noreferrer"
          >
            О сервисе
            <ArrowUpRightIcon weight="regular" size={12} />
          </a>
        </div>
      </footer>
    </div>
  );
}
export default App;
