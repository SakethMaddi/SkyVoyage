import {
  formatDuration,
  formatStops,
  formatTime,
} from "../../utils/formatters.js";
import styles from "./FlightResultCard.module.css";

export default function FlightResultCard({ flight, passengerCount, onSelect }) {
  return (
    <div className={styles.card}>
      <div className={styles.airline}>{flight.airline}</div>
      <div className={styles.timeBlock}>
        <h3>{formatTime(flight.departureTime)}</h3>
        <span>{flight.from.code}</span>
      </div>
      <div className={styles.duration}>
        <span>{formatDuration(flight.duration)}</span>
        <div className={styles.line}>
          <span className={`${styles.dotBase} ${styles.dotStart}`} />
          {flight.stops > 0 && (
            <span className={`${styles.dotBase} ${styles.dotMid}`} />
          )}
          <span className={`${styles.dotBase} ${styles.dotEnd}`} />
        </div>
        <span>{formatStops(flight.stops)}</span>
      </div>
      <div className={styles.timeBlock}>
        <h3>{formatTime(flight.arrivalTime)}</h3>
        <span>{flight.to.code}</span>
      </div>
      <div className={styles.price}>
        ${flight.price.economy}
        <p>Economy</p>
        ${flight.price.business}
        <p>Business</p>
        <button
          type="button"
          className={styles.selectBtn}
          onClick={() => onSelect(flight, passengerCount)}
        >
          Select
        </button>
      </div>
    </div>
  );
}
