import styles from "./App.module.scss";
import {
  ArrowUpRight,
  Search,
  LibraryBig,
  LifeBuoy,
  LogIn,
  ArrowRight,
  CircleHelp,
} from "lucide-react";
import SearchPartsFeature from "@/features/parts/searchParts/SearchPartsFeature.jsx";
function App() {
  return (
    <div className={styles.app}>
      <aside className={styles.rail} aria-label="Быстрые ссылки">
        <a className={styles.railMark} href="/" aria-label="FAVORIT — начало">
          F<span>.</span>
        </a>
        <nav className={styles.railNav} aria-label="Инструменты">
          <a
            className={styles.railActive}
            href="#part-search"
            aria-label="Поиск запчастей"
            title="Поиск запчастей"
          >
            <Search size={21} />
          </a>
          <a
            href="https://favorit-parts.ru/brands/"
            target="_blank"
            rel="noreferrer"
            aria-label="Каталог брендов"
            title="Каталог брендов"
          >
            <LibraryBig size={21} />
          </a>
        </nav>
        <a
          className={styles.railHelp}
          href="https://favorit-parts.ru/company/contacts/"
          target="_blank"
          rel="noreferrer"
          aria-label="Контакты FAVORIT"
          title="Контакты FAVORIT"
        >
          <CircleHelp size={21} />
        </a>
        <span className={styles.railLabel}>FAVORIT PARTS</span>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <a className={styles.logo} href="/" aria-label="FAVORIT — главная">
              <img
                src="/brand/favorit-logo-blue.svg"
                alt="FAVORIT"
                width="148"
                height="70"
              />
            </a>
            <span className={styles.headerDivider} />
            <span className={styles.productName}>Подбор запчастей</span>
            <div className={styles.headerActions}>
              <a
                className={styles.helpLink}
                href="https://favorit-parts.ru/company/contacts/"
                target="_blank"
                rel="noreferrer"
              >
                <LifeBuoy size={17} />
                <span>Помощь</span>
              </a>
              <a
                className={styles.accountLink}
                href="https://lk.favorit-parts.ru/"
                target="_blank"
                rel="noreferrer"
              >
                <span>Личный кабинет</span>
                <LogIn size={15} />
              </a>
            </div>
          </div>
        </header>
        <main className={styles.main}>
          <section className={styles.intro} aria-labelledby="page-title">
            <div>
              <div className={styles.eyebrow}>
                <span />
                FAVORIT<span className={styles.eyebrowDivider}>/</span>КАТАЛОГ
              </div>
              <h1 id="page-title">
                Точный поиск
                <span>
                  Свободный выбор<span className={styles.period}>.</span>
                </span>
              </h1>
            </div>
            <div className={styles.introAside}>
              <span className={styles.asideNumber}>01 — 02</span>
              <p>
                От артикула до подходящей детали.
                <br />
                Сравнивайте бренды, цены и наличие.
                <br />
                Принимайте решение на своих условиях.
              </p>
              <span className={styles.asideCaption}>
                Всё для уверенного выбора
                <ArrowRight size={15} />
              </span>
            </div>
          </section>
          <SearchPartsFeature />
          <div className={styles.helpStrip}>
            <span>
              <LifeBuoy size={17} />
              <span>Артикул ищите на упаковке или корпусе детали.</span>
            </span>
            <a
              href="https://favorit-parts.ru/company/contacts/"
              target="_blank"
              rel="noreferrer"
            >
              Нужна помощь?
              <ArrowUpRight size={15} />
            </a>
          </div>
        </main>
        <footer className={styles.footer}>
          <span>
            © {new Date().getFullYear()} ООО «ЮРАЛ»
            <span className={styles.footerDivider}>·</span>FAVORIT
          </span>
          <a href="https://favorit-parts.ru/" target="_blank" rel="noreferrer">
            О компании
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
        </footer>
      </div>
    </div>
  );
}
export default App;
