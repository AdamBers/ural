import { useMemo, useRef, useState } from 'react';
import { SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import OfferRow from '../../../../entities/parts/ui/OfferRow.jsx';
import StatusPanel from '../../../../shared/ui/StatusPanel.jsx';
import OffersPagination from './OffersPagination.jsx';
const PAGE_SIZE = 50;
function OffersTable({ offers }) {
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(0);
  const scrollArea = useRef(null);
  const visible = useMemo(() => offers.filter(offer => !onlyAvailable || offer.stock > 0).sort((a, b) => sort === 'price' ? (a.price ?? Infinity) - (b.price ?? Infinity) : sort === 'stock' ? b.stock - a.stock : 0), [offers, onlyAvailable, sort]);
  const changePage = value => { setPage(value); scrollArea.current?.scrollTo({ top: 0 }); };
  return <><div className="table-toolbar"><span className="result-count">Предложений: <b>{visible.length}</b></span><div className="table-controls"><label className="availability"><SlidersHorizontal size={15} /><input type="checkbox" checked={onlyAvailable} onChange={event => { setOnlyAvailable(event.target.checked); changePage(0); }} />Только в наличии</label><label className="sort"><ArrowDownUp size={15} /><select aria-label="Сортировка предложений" value={sort} onChange={event => { setSort(event.target.value); changePage(0); }}><option value="default">По умолчанию</option><option value="price">Сначала дешевле</option><option value="stock">По остатку</option></select></label></div></div>{visible.length === 0 ? <StatusPanel title="Нет подходящих предложений">Отключите фильтр наличия или выберите другого производителя.</StatusPanel> : <div className="table-scroll" ref={scrollArea} tabIndex={0} aria-label="Предложения складов"><table><thead><tr><th>Производитель / артикул</th><th>Наименование</th><th>Склад</th><th>В наличии</th><th className="price">Цена</th></tr></thead><tbody>{visible.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(offer => <OfferRow key={offer.id} offer={offer} />)}</tbody></table></div>}<OffersPagination page={page} pages={Math.ceil(visible.length / PAGE_SIZE)} total={visible.length} pageSize={PAGE_SIZE} onPageChange={changePage} /><div className="table-note"><span className="warehouse-dot" />Цены указаны за единицу товара на конкретном складе.</div></>;
}
export default OffersTable;
