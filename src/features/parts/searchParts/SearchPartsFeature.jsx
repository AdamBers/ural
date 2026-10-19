import styles from "./SearchPartsFeature.module.scss";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, ArrowRight, Check, X } from "lucide-react";
import {
  fetchBrands,
  fetchOffers,
  setNumber,
  setMode,
  selectBrand,
} from "@/features/parts/searchParts/model/searchSlice.js";
import BrandCard from "@/entities/parts/ui/BrandCard.jsx";
import StatusPanel from "@/shared/ui/StatusPanel.jsx";
import OffersTable from "@/features/parts/searchParts/ui/OffersTable.jsx";
function SearchPartsFeature() {
  const dispatch = useDispatch();
  const {
    number,
    brand,
    mode,
    brands,
    offers,
    brandsStatus,
    offersStatus,
    error,
  } = useSelector((state) => state.search);
  const searchInput = useRef(null);
  useEffect(() => {
    if (!number.trim()) return;
    let request;
    const timer = setTimeout(() => {
      request = dispatch(fetchBrands({ number: number.trim(), mode }));
    }, 500);
    return () => {
      clearTimeout(timer);
      request?.abort();
    };
  }, [number, mode, dispatch]);
  useEffect(() => {
    if (!brand) return;
    const request = dispatch(
      fetchOffers({ number: number.trim(), brand, mode }),
    );
    return () => request.abort();
  }, [brand, number, mode, dispatch]);
  const retry = () =>
    dispatch(
      brand
        ? fetchOffers({ number: number.trim(), brand, mode })
        : fetchBrands({ number: number.trim(), mode }),
    );
  const chooseExample = (value) => {
    dispatch(setNumber(value));
    searchInput.current?.focus();
  };
  let brandContent;
  if (brandsStatus === "loading" || (number.trim() && brandsStatus === "idle"))
    brandContent = (
      <StatusPanel kind="loading" title="Ищем производителей">
        Проверяем артикул в каталоге.
      </StatusPanel>
    );
  else if (brandsStatus === "error")
    brandContent = (
      <StatusPanel kind="error" title="Поиск не выполнен" onRetry={retry}>
        {error}
      </StatusPanel>
    );
  else if (brandsStatus === "success" && !brands.length)
    brandContent = (
      <StatusPanel title="Артикул не найден">
        Проверьте номер детали и попробуйте ещё раз.
      </StatusPanel>
    );
  else if (brands.length)
    brandContent = (
      <div className={styles.brandGrid}>
        {brands.map((item, index) => (
          <BrandCard
            key={item.brand}
            item={item}
            index={index}
            selected={brand === item.brand}
            onSelect={(value) => dispatch(selectBrand(value))}
          />
        ))}
      </div>
    );
  else
    brandContent = (
      <StatusPanel title="Начните с артикула">
        Введите номер детали — найдём доступных производителей.
      </StatusPanel>
    );
  let offerContent;
  if (offersStatus === "loading")
    offerContent = (
      <StatusPanel kind="loading" title="Подбираем предложения">
        Ищем деталь и её аналоги на складах.
      </StatusPanel>
    );
  else if (offersStatus === "error")
    offerContent = (
      <StatusPanel
        kind="error"
        title="Не удалось получить предложения"
        onRetry={retry}
      >
        {error}
      </StatusPanel>
    );
  else if (offersStatus === "success" && !offers.length)
    offerContent = (
      <StatusPanel title="Предложений пока нет">
        Выберите другого производителя или измените артикул.
      </StatusPanel>
    );
  else if (offersStatus === "success")
    offerContent = (
      <OffersTable key={`${number}-${brand}-${mode}`} offers={offers} />
    );
  else
    offerContent = (
      <StatusPanel title="Здесь появятся предложения">
        {brands.length
          ? "Производитель на предыдущем шаге."
          : "Сначала укажите артикул и выберите производителя."}
      </StatusPanel>
    );
  return (
    <div className={styles.workspace}>
      <section className={styles.searchCard} id="part-search">
        <h2>Номер детали</h2>
        <p className={styles.searchDescription}>
          Введите номер с упаковки детали.
        </p>
        <label className={styles.inputLabel} htmlFor="part-number">
          Артикул детали
        </label>
        <div className={styles.searchInputWrap}>
          <Search size={21} />
          <input
            ref={searchInput}
            id="part-number"
            placeholder="Например, W 914/2"
            maxLength={80}
            autoComplete="off"
            value={number}
            onChange={(event) => dispatch(setNumber(event.target.value))}
          />
          <button
            className={`${styles.clearButton} ${number ? "" : styles.hidden}`}
            disabled={!number}
            aria-label="Очистить артикул"
            onClick={() => dispatch(setNumber(""))}
          >
            <X size={18} />
          </button>
          <span className={styles.searchInputHint}>Автопоиск</span>
        </div>
        <div className={styles.examples}>
          <span>Попробуйте:</span>
          {["W 914/2", "01089", "7160500039S"].map((value) => (
            <button key={value} onClick={() => chooseExample(value)}>
              {value}
              <ArrowRight size={12} />
            </button>
          ))}
        </div>
        <div className={styles.searchCardBottom}>
          <span className={mode === "demo" ? styles.demoStatus : ""}>
            <span className={styles.smallDot} />
            {mode === "demo"
              ? "Демо · учебные данные"
              : "Поиск в каталоге Favorit-parts"}
          </span>
          <button
            className={styles.modeSwitch}
            onClick={() => dispatch(setMode(mode === "demo" ? "live" : "demo"))}
          >
            {mode === "demo" ? "Вернуться к каталогу" : "Посмотреть демо"}
            <ArrowRight size={13} />
          </button>
        </div>
      </section>
      <section className={`${styles.resultsSection} ${styles.brandsSection}`}>
        <div className={styles.stepHeading}>
          <span
            className={`${styles.stepNumber} ${brand ? styles.complete : ""}`}
          >
            {brand ? <Check size={18} /> : "01"}
          </span>
          <div>
            <h2>Производитель</h2>
            <p>Производители для вашего артикула</p>
          </div>
          {brands.length > 0 && (
            <span className={styles.countBadge}>{brands.length}</span>
          )}
        </div>
        <div
          className={styles.brandResults}
          tabIndex={0}
          aria-label="Список производителей"
        >
          {brandContent}
        </div>
      </section>
      <section className={`${styles.resultsSection} ${styles.offersSection}`}>
        <div className={styles.stepHeading}>
          <span
            className={`${styles.stepNumber} ${brand ? styles.active : ""}`}
          >
            02
          </span>
          <div>
            <h2>Предложения и аналоги</h2>
            <p>
              {brand
                ? `${brand} · ${number}`
                : "Сравните цены и наличие на складах"}
            </p>
          </div>
          {offers.length > 0 && (
            <span className={styles.countBadge}>{offers.length}</span>
          )}
        </div>
        <div className={styles.offersBox}>{offerContent}</div>
      </section>
    </div>
  );
}
export default SearchPartsFeature;
