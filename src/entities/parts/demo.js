const item = (goodsID, brand, number, name, prices) => ({ goodsID, brand, number, name, warehouses: prices.map(([code, price, stock], i) => ({ id: `${goodsID}-${i}`, code, price, stock, own: i === 0 })) });
export function getDemoGoods(number, brand) {
  if (number.toLowerCase() === 'empty') return [];
  const brands = ['MANN-FILTER', 'BOSCH', 'MAHLE', 'FILTRON'];
  if (!brand) return brands.map((name, i) => item(`brand-${i}`, name, number, 'Фильтр масляный', [['МС2', 740 + i * 160, 12 + i * 7]]));
  return [{ ...item('original', brand, number, 'Фильтр масляный', [['МС2', 890, 24], ['СПБ', 940, 8]]), analogues: [
    item('bosch', 'BOSCH', '0 451 103 336', 'Фильтр масляный, навинчиваемый', [['МС2', 625, 42]]),
    item('mahle', 'MAHLE', 'OC 384', 'Фильтр масляный двигателя', [['ЕКБ', 780, 16], ['МС2', 810, 5]]),
    item('filtron', 'FILTRON', 'OP 575', 'Фильтр масляный', [['КРД', 485, 63]]),
    item('hengst', 'HENGST', 'H14W30', 'Фильтр масляный, сменный', [['МС2', 1120, 7]]),
    item('purflux', 'PURFLUX', 'LS932', 'Фильтр масляный', [['НСК', 690, 0]]),
  ] }];
}
