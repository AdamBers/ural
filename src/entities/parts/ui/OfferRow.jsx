import styles from "./OfferRow.module.scss";
const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
});
function OfferRow({ offer }) {
  return (
    <tr className={styles.row}>
      <td>
        <strong>{offer.brand}</strong>
        <span className={styles.article}>{offer.number}</span>
      </td>
      <td>
        <span className={styles.offerName} title={offer.name}>
          {offer.name || "Название не указано"}
        </span>
        <div className={styles.rowTags}>
          <span
            className={`${styles.tag} ${offer.analogue ? "" : styles.original}`}
          >
            {offer.analogue ? "Аналог" : "Искомая деталь"}
          </span>
          {offer.notRefund && (
            <span className={styles.muted}>Без возврата</span>
          )}
        </div>
      </td>
      <td>
        <span className={styles.warehouseDot} />
        {offer.warehouse}
        <span className={styles.article}>
          {offer.own ? "Собственный склад" : "Поставщик"}
        </span>
      </td>
      <td>
        <span
          className={`${styles.stock} ${offer.stock > 0 ? "" : styles.unavailable}`}
        >
          {offer.stock > 0 ? `${offer.stock} шт.` : "Нет в наличии"}
        </span>
      </td>
      <td className={styles.price} data-testid="offer-price">
        {offer.price === null ? "—" : currency.format(offer.price)}
      </td>
    </tr>
  );
}
export default OfferRow;
