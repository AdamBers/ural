import styles from "./App.module.scss";
import {
  ArrowUpRight,
  LifeBuoy,
  Boxes,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import SearchPartsFeature from "@/features/parts/searchParts/SearchPartsFeature.jsx";
function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.logo} href="/" aria-label="ЮРАЛ — главная">
            <span className={styles.logoSymbol}>ю</span>
            <span className={styles.logoType}>
              ЮРАЛ<span>FAVORIT-PARTS</span>
            </span>
          </a>
          <span className={styles.headerDivider} />
          <span className={styles.headerCaption}>Профессионалам автодела</span>
          <a
            className={styles.supportLink}
            href="https://lk.favorit-parts.ru/static/wsprice.pdf"
            target="_blank"
            rel="noreferrer"
          >
            <LifeBuoy size={17} />
            Документация API
            <ArrowUpRight size={14} />
          </a>
        </div>
      </header>
      <div className={styles.navBar}>
        <div className={styles.navInner}>
          <span className={styles.navActive}>
            <Boxes size={17} />
            Подбор запчастей
          </span>
          <span className={styles.navCaption}>
            Каталог и предложения поставщиков
          </span>
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.breadcrumbs}>
          <span>Каталог</span>
          <ChevronRight size={12} />
          <span>Подбор запчастей</span>
        </div>
        <div className={styles.pageHeading}>
          <div>
            <div className={styles.eyebrow}>НУЖНАЯ ДЕТАЛЬ. ТОЧНЫЙ ВЫБОР.</div>
            <h1>
              Подбор запчастей<span>.</span>
            </h1>
            <p>От артикула до подходящего предложения — за два шага.</p>
          </div>
          <div className={styles.headingMark}>
            <ShieldCheck size={19} />
            <span>Точность в каждой детали</span>
          </div>
        </div>
        <SearchPartsFeature />
        <div className={styles.helpStrip}>
          <div>
            <LifeBuoy size={21} />
            <span>
              <strong>Не знаете артикул?</strong>
              <span>Номер можно найти на упаковке или корпусе детали.</span>
            </span>
          </div>
          <span className={styles.helpCaption}>
            Обращайте внимание на буквы, цифры и разделители
          </span>
        </div>
      </main>
      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} ООО «ЮРАЛ»{" "}
          <span className={styles.footerDot}>/</span> Favorit-parts
        </span>
        <span>Тестовое приложение · React + Redux</span>
      </footer>
    </div>
  );
}
export default App;
