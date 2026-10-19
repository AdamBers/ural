export function getBrands(goods) {
  return [
    ...new Map(
      goods.map((item) => [
        item.brand,
        { brand: item.brand, name: item.name, number: item.number },
      ]),
    ).values(),
  ];
}
export function getOffers(goods) {
  const offers = new Map();
  function visit(item, analogue = false) {
    const warehouses = item.warehouses?.length
      ? item.warehouses
      : [{ id: "unavailable", price: null, stock: 0 }];
    warehouses.forEach((warehouse, index) => {
      const id = JSON.stringify([
        item.goodsID || item.number,
        item.brand,
        warehouse.id || warehouse.code || index,
      ]);
      if (!offers.has(id))
        offers.set(id, {
          id,
          brand: item.brand,
          number: item.number,
          name: item.name,
          price: warehouse.price ?? null,
          stock: warehouse.stock ?? 0,
          warehouse: warehouse.code || "Склад поставщика",
          own: warehouse.own,
          analogue,
          notRefund: item.notRefund || warehouse.notRefund,
        });
    });
    item.analogues?.forEach((child) => visit(child, true));
  }
  goods.forEach((item) => visit(item));
  return [...offers.values()];
}
