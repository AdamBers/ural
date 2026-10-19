import styles from "./App.module.scss";
import {
  ArrowUpRight,
  ArrowRight,
  LifeBuoy,
  Boxes,
  ChevronRight,
  Phone,
  ArrowDown,
  ScanLine,
  Layers3,
  ExternalLink,
} from "lucide-react";
import SearchPartsFeature from "@/features/parts/searchParts/SearchPartsFeature.jsx";
function App() {
  return (
    <div className={styles.app}>
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
          <span className={styles.headerCaption}>
            Международный оптовый
            <br />
            гипермаркет автозапчастей
          </span>
          <a className={styles.phone} href="tel:88007778548">
            <Phone size={16} />
            <span>
              <strong>8 800 777-85-48</strong>
              <small>Бесплатно по России</small>
            </span>
          </a>
          <a
            className={styles.supportLink}
            href="https://favorit-parts.ru/"
            target="_blank"
            rel="noreferrer"
          >
            Сайт компании
            <ArrowUpRight size={16} />
          </a>
        </div>
      </header>
      <nav className={styles.navBar} aria-label="Основная навигация">
        <div className={styles.navInner}>
          <span className={styles.navActive}>
            <Boxes size={17} />
            Подбор запчастей
          </span>
          <div className={styles.navLinks}>
            <a
              href="https://favorit-parts.ru/brands/"
              target="_blank"
              rel="noreferrer"
            >
              Бренды
            </a>
            <a
              href="https://favorit-parts.ru/servis/dostavka/"
              target="_blank"
              rel="noreferrer"
            >
              Доставка
            </a>
            <a
              href="https://favorit-parts.ru/company/o-nas/"
              target="_blank"
              rel="noreferrer"
            >
              О компании
            </a>
          </div>
          <a
            className={styles.accountLink}
            href="https://lk.favorit-parts.ru/"
            target="_blank"
            rel="noreferrer"
          >
            Личный кабинет
            <ExternalLink size={14} />
          </a>
        </div>
      </nav>
      <main className={styles.main}>
        <div className={styles.breadcrumbs}>
          <span>FAVORIT</span>
          <ChevronRight size={12} />
          <span>Подбор запчастей</span>
        </div>
        <section className={styles.hero} aria-labelledby="hero-title">
          <img
            className={styles.heroImage}
            src="/brand/warehouse.webp"
            alt=""
            width="1400"
            height="930"
            fetchPriority="high"
          />
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span />
              ЗАПЧАСТИ. АНАЛОГИ. ТОЧНЫЙ ВЫБОР.
            </div>
            <h1 id="hero-title">
              Ваш фаворит<span>в выборе запчастей.</span>
            </h1>
            <p>
              Нужная деталь начинается с точного поиска.
              <br />
              Сравните производителей, цены и наличие — в одном месте.
            </p>
          </div>
          <div className={styles.heroAside} aria-hidden="true">
            <span className={styles.asideEyebrow}>
              ВСЁ НАЧИНАЕТСЯ С АРТИКУЛА
            </span>
            <div className={styles.heroStep}>
              <span>
                <ScanLine size={21} />
              </span>
              <div>
                <b>Найдите деталь</b>
                <small>Введите номер с упаковки</small>
              </div>
              <span className={styles.stepIndex}>01</span>
            </div>
            <ArrowDown className={styles.connector} size={18} />
            <div className={styles.heroStep}>
              <span>
                <Layers3 size={21} />
              </span>
              <div>
                <b>Выберите лучшее</b>
                <small>Сравните предложения складов</small>
              </div>
              <span className={styles.stepIndex}>02</span>
            </div>
            <div className={styles.asideFooter}>
              Один поиск. Больше возможностей.
              <ArrowRight size={15} />
            </div>
          </div>
        </section>
        <SearchPartsFeature />
        <div className={styles.helpStrip}>
          <div>
            <span className={styles.helpIcon}>
              <LifeBuoy size={21} />
            </span>
            <span>
              <strong>Нужна небольшая подсказка?</strong>
              <span>Артикул обычно указан на упаковке или корпусе детали.</span>
            </span>
          </div>
          <a
            href="https://favorit-parts.ru/company/contacts/"
            target="_blank"
            rel="noreferrer"
          >
            Связаться с FAVORIT
            <ArrowUpRight size={16} />
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} ООО «ЮРАЛ»
          <span className={styles.footerDot}>/</span>FAVORIT
        </span>
        <span>Ваш фаворит в выборе автозапчастей</span>
        <a
          href="https://lk.favorit-parts.ru/static/wsprice.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Документация сервиса
          <ArrowUpRight size={12} />
        </a>
      </footer>
    </div>
  );
}
export default App;
