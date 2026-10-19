import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ArrowRight, Check, Info, X, PackageSearch } from 'lucide-react';
import { fetchBrands, fetchOffers, setNumber, setMode, selectBrand } from './model/searchSlice.js';
import BrandCard from '../../../entities/parts/ui/BrandCard.jsx';
import StatusPanel from '../../../shared/ui/StatusPanel.jsx';
import OffersTable from './ui/OffersTable.jsx';
function SearchPartsFeature() {
  const dispatch = useDispatch();
  const { number, brand, mode, brands, offers, brandsStatus, offersStatus, error } = useSelector(state => state.search);
  const searchInput = useRef(null);
  useEffect(() => {
    if (!number.trim()) return;
    let request;
    const timer = setTimeout(() => { request = dispatch(fetchBrands({ number: number.trim(), mode })); }, 500);
    return () => { clearTimeout(timer); request?.abort(); };
  }, [number, mode, dispatch]);
  useEffect(() => {
    if (!brand) return;
    const request = dispatch(fetchOffers({ number: number.trim(), brand, mode }));
    return () => request.abort();
  }, [brand, number, mode, dispatch]);
  const retry = () => dispatch(brand ? fetchOffers({ number: number.trim(), brand, mode }) : fetchBrands({ number: number.trim(), mode }));
  const chooseExample = value => { dispatch(setNumber(value)); searchInput.current?.focus(); };
  let brandContent;
  if (brandsStatus === 'loading' || (number.trim() && brandsStatus === 'idle')) brandContent = <StatusPanel kind="loading" title="Ищем производителей">Проверяем артикул в каталоге.</StatusPanel>;
  else if (brandsStatus === 'error') brandContent = <StatusPanel kind="error" title="Поиск не выполнен" onRetry={retry}>{error}</StatusPanel>;
  else if (brandsStatus === 'success' && !brands.length) brandContent = <StatusPanel title="Артикул не найден">Проверьте номер детали и попробуйте ещё раз.</StatusPanel>;
  else if (brands.length) brandContent = <div className="brand-grid">{brands.map((item, index) => <BrandCard key={item.brand} item={item} index={index} selected={brand === item.brand} onSelect={value => dispatch(selectBrand(value))} />)}</div>;
  else brandContent = <StatusPanel title="Начните с артикула">Введите номер детали — найдём доступных производителей.</StatusPanel>;
  let offerContent;
  if (offersStatus === 'loading') offerContent = <StatusPanel kind="loading" title="Подбираем предложения">Ищем деталь и её аналоги на складах.</StatusPanel>;
  else if (offersStatus === 'error') offerContent = <StatusPanel kind="error" title="Не удалось получить предложения" onRetry={retry}>{error}</StatusPanel>;
  else if (offersStatus === 'success' && !offers.length) offerContent = <StatusPanel title="Предложений пока нет">Выберите другого производителя или измените артикул.</StatusPanel>;
  else if (offersStatus === 'success') offerContent = <OffersTable key={`${number}-${brand}-${mode}`} offers={offers} />;
  else offerContent = <StatusPanel title="Здесь появятся предложения">{brands.length ? 'Выберите производителя на предыдущем шаге.' : 'Сначала укажите артикул и выберите производителя.'}</StatusPanel>;
  return <><div className="mode-banner"><div><Info size={18} /><span>{mode === 'demo' ? <><strong>Демонстрационный режим.</strong> Пример данных для знакомства с подбором.</> : <><strong>Реальный API.</strong> Для запросов нужен ключ покупателя на сервере.</>}</span></div><button onClick={() => dispatch(setMode(mode === 'demo' ? 'live' : 'demo'))}>{mode === 'demo' ? 'Подключить API' : 'Вернуться к демо'}<ArrowRight size={15} /></button></div><section className="search-card"><div className="section-eyebrow"><PackageSearch size={18} />ПОИСК ПО КАТАЛОГУ</div><h2>Какая деталь вам нужна?</h2><p className="search-description">Введите артикул — мы найдём производителей, аналоги и предложения.</p><label className="input-label" htmlFor="part-number">Артикул детали</label><div className="search-input-wrap"><Search size={21} /><input ref={searchInput} id="part-number" placeholder="Например, W 914/2" maxLength={80} autoComplete="off" value={number} onChange={event => dispatch(setNumber(event.target.value))} />{number && <button className="clear-button" aria-label="Очистить артикул" onClick={() => dispatch(setNumber(''))}><X size={18} /></button>}<span className="search-input-hint">Автопоиск</span></div><div className="examples"><span>Попробуйте:</span>{['W 914/2', '01089', '7160500039S'].map(value => <button key={value} onClick={() => chooseExample(value)}>{value}<ArrowRight size={12} /></button>)}</div><div className="search-card-bottom"><span><span className="small-dot" />{mode === 'demo' ? 'Демонстрационный каталог' : 'Каталог Favorit-parts'}</span><span>Поиск начинается автоматически</span></div></section><section className="results-section"><div className="step-heading"><span className={`step-number ${brand ? 'complete' : ''}`}>{brand ? <Check size={18} /> : '01'}</span><div><h2>Выберите производителя</h2><p>Один артикул может встречаться у разных брендов</p></div>{brands.length > 0 && <span className="count-badge">{brands.length}</span>}</div><div className="brand-results" tabIndex={0} aria-label="Список производителей">{brandContent}</div></section><section className="results-section offers-section"><div className="step-heading"><span className={`step-number ${brand ? 'active' : ''}`}>02</span><div><h2>Предложения и аналоги</h2><p>{brand ? `${brand} · ${number}` : 'Сравните цены и наличие на складах'}</p></div>{offers.length > 0 && <span className="count-badge">{offers.length}</span>}</div><div className="offers-box">{offerContent}</div></section></>;
}
export default SearchPartsFeature;
