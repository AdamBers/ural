import { ArrowUpRight, Check } from 'lucide-react';
function BrandCard({ item, selected, onSelect, index }) {
  return <button className={`brand-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(item.brand)} aria-pressed={selected}><span className={`brand-monogram brand-${index % 4}`}>{item.brand.slice(0, 1)}</span><span className="brand-copy"><strong>{item.brand}</strong><span>{item.name || 'Автозапчасти'}</span></span>{selected ? <Check size={19} /> : <ArrowUpRight size={18} />}</button>;
}
export default BrandCard;
