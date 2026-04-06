import FlightFilters from "./FlightFilters.jsx";
import FlightResultCard from "./FlightResultCard.jsx";
import styles from "./ResultsSection.module.css";

export default function ResultsSection({
  visible,
  routeTitle,
  flightCountText,
  sortBy,
  onSortChange,
  filterProps,
  flights,
  passengerCount,
  onSelectFlight,
}) {
  if (!visible) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{routeTitle}</h2>
        <p className={styles.count}>{flightCountText}</p>

        <div className={styles.sortRow}>
          <p>Sort by:</p>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="cheap">Cheaper First</option>
            <option value="best">Best Value</option>
            <option value="fast">Fastest First</option>
          </select>
        </div>
      </div>

      <div className={styles.layout}>
        <FlightFilters {...filterProps} />

        <div className={styles.list}>
          {flights.length === 0 ? (
            <p className={styles.empty}>
              ⚠️ No flights found. Try adjusting filters.
            </p>
          ) : (
            flights.map((flight) => (
              <FlightResultCard
                key={flight.id || flight.flightNumber}
                flight={flight}
                passengerCount={passengerCount}
                onSelect={onSelectFlight}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}