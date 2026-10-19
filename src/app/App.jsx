import styles from "./App.module.scss";
import { ArrowUpRight, CircleHelp, ArrowRight, ScanLine } from "lucide-react";
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
            favorit
            <span className={styles.brandDot} />
            <span className={styles.brandSuffix}>parts</span>
          </a>
          <a className={styles.currentPage} href="#part-search">
            <ScanLine size={15} />
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
              <CircleHelp size={18} />
              <span>Помощь</span>
            </a>
            <a
              className={styles.accountLink}
              href="https://lk.favorit-parts.ru/"
              target="_blank"
              rel="noreferrer"
            >
              <span>Личный кабинет</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.pageHeading}>
          <div>
            <div className={styles.eyebrow}>КАТАЛОГ АВТОЗАПЧАСТЕЙ</div>
            <h1>
              Поиск запчастей<span> / </span>
              <small>По артикулу</small>
            </h1>
          </div>
          <p>
            Нужная деталь — среди тысяч предложений.
            <br />
            Найдём, сравним, покажем наличие.
          </p>
        </div>
        <SearchPartsFeature />
        <div className={styles.helper}>
          <span>
            <ScanLine size={15} />
            Сохраняйте буквы, цифры и разделители артикула.
          </span>
          <a
            href="https://favorit-parts.ru/company/contacts/"
            target="_blank"
            rel="noreferrer"
          >
            Помочь с поиском?
            <ArrowRight size={14} />
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
            <ArrowUpRight size={12} />
          </a>
          <a
            href="https://lk.favorit-parts.ru/static/wsprice.pdf"
            target="_blank"
            rel="noreferrer"
          >
            О сервисе
            <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
    </div>
  );
}
export default App;
