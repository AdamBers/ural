const currency = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 });
function OfferRow({ offer }) {
  return <tr><td><strong>{offer.brand}</strong><span className="article">{offer.number}</span></td><td><span className="offer-name" title={offer.name}>{offer.name || 'Название не указано'}</span><div className="row-tags"><span className={offer.analogue ? 'tag' : 'tag original'}>{offer.analogue ? 'Аналог' : 'Искомая деталь'}</span>{offer.notRefund && <span className="muted">Без возврата</span>}</div></td><td><span className="warehouse-dot" />{offer.warehouse}<span className="article">{offer.own ? 'Собственный склад' : 'Поставщик'}</span></td><td><span className={`stock ${offer.stock > 0 ? '' : 'unavailable'}`}>{offer.stock > 0 ? `${offer.stock} шт.` : 'Нет в наличии'}</span></td><td className="price">{offer.price === null ? '—' : currency.format(offer.price)}</td></tr>;
}
export default OfferRow;
