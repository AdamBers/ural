import { FadersHorizontalIcon } from "@phosphor-icons/react/dist/csr/FadersHorizontal";
import { ArrowsDownUpIcon } from "@phosphor-icons/react/dist/csr/ArrowsDownUp";
import styles from "./OffersTable.module.scss";
import { useMemo, useRef, useState } from "react";

import OfferRow from "@/entities/parts/ui/OfferRow.jsx";
import Select from "@/shared/ui/Select.jsx";
import StatusPanel from "@/shared/ui/StatusPanel.jsx";
import OffersPagination from "@/features/parts/searchParts/ui/OffersPagination.jsx";
const PAGE_SIZE = 50;
const SORT_OPTIONS = [
  { value: "default", label: "По умолчанию" },
  { value: "price", label: "Сначала дешевле" },
  { value: "stock", label: "По остатку" },
];
function OffersTable({ offers }) {
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(0);
  const scrollArea = useRef(null);
  const visible = useMemo(
    () =>
      offers
        .filter((offer) => !onlyAvailable || offer.stock > 0)
        .sort((a, b) =>
          sort === "price"
            ? (a.price ?? Infinity) - (b.price ?? Infinity)
            : sort === "stock"
              ? b.stock - a.stock
              : 0,
        ),
    [offers, onlyAvailable, sort],
  );
  const changePage = (value) => {
    setPage(value);
    scrollArea.current?.scrollTo({ top: 0 });
  };
  return (
    <>
      <div className={styles.tableToolbar}>
        <span className={styles.resultCount}>
          Предложений: <b>{visible.length}</b>
        </span>
        <div className={styles.tableControls}>
          <label className={styles.availability}>
            <FadersHorizontalIcon size={15} />
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(event) => {
                setOnlyAvailable(event.target.checked);
                changePage(0);
              }}
            />
            Только в наличии
          </label>
          <div className={styles.sort}>
            <ArrowsDownUpIcon size={15} aria-hidden="true" />
            <Select
              label="Сортировка предложений"
              value={sort}
              options={SORT_OPTIONS}
              onChange={(value) => {
                setSort(value);
                changePage(0);
              }}
            />
          </div>
        </div>
      </div>
      {visible.length === 0 ? (
        <StatusPanel title="Нет подходящих предложений">
          Отключите фильтр наличия или выберите другого производителя.
        </StatusPanel>
      ) : (
        <div
          className={styles.tableScroll}
          data-testid="offers-scroll"
          ref={scrollArea}
          tabIndex={0}
          aria-label="Предложения складов"
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Производитель / артикул</th>
                <th>Наименование</th>
                <th>Склад</th>
                <th>В наличии</th>
                <th className={styles.price}>Цена</th>
              </tr>
            </thead>
            <tbody>
              {visible
                .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
                .map((offer) => (
                  <OfferRow key={offer.id} offer={offer} />
                ))}
            </tbody>
          </table>
        </div>
      )}
      <OffersPagination
        page={page}
        pages={Math.ceil(visible.length / PAGE_SIZE)}
        total={visible.length}
        pageSize={PAGE_SIZE}
        onPageChange={changePage}
      />
      <div className={styles.tableNote}>
        <span className={styles.warehouseDot} />
        Цены указаны за единицу товара на конкретном складе.
      </div>
    </>
  );
}
export default OffersTable;
