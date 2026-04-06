import styles from "./FlightFilters.module.css";

export default function FlightFilters({
  minPrice,
  maxPrice,
  priceValue,
  onPriceInput,
  stopOptions,
  selectedStops,
  onStopChange,
  airlines,
  selectedAirlines,
  onAirlineChange,
  onApply,
}) {
  return (
    <aside className={styles.filters}>
      <div className={styles.group}>
        <h4>Max Price</h4>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceValue}
          onChange={(e) => onPriceInput(Number(e.target.value))}
        />
        <p>
          Up to $<span>{priceValue}</span>
        </p>
      </div>
      <div className={styles.group}>
        <h4>Stops</h4>
        {stopOptions.map((s) => (
          <label key={s}>
            <input
              type="checkbox"
              checked={selectedStops.includes(s)}
              onChange={() => onStopChange(s)}
            />
            {s === 0 ? "Direct" : s === 1 ? "1 Stop" : `${s} stops`}
          </label>
        ))}
      </div>
      <div className={styles.group}>
        <h4>Airlines</h4>
        {airlines.map((name) => (
          <label key={name}>
            <input
              type="checkbox"
              checked={selectedAirlines.includes(name)}
              onChange={() => onAirlineChange(name)}
            />
            {name}
          </label>
        ))}
        <button type="button" className={styles.applyBtn} onClick={onApply}>
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
