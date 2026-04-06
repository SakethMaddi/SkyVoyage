import styles from "./SeatPricingSummary.module.css";

export default function SeatPricingSummary({
  selectedSeats,
  baseFare,
  seatUpgrade,
  total,
}) {
  return (
    <div className={styles.card}>
      <h3>Your Selection</h3>
      <p>
        {selectedSeats.length === 0
          ? "No seats selected"
          : `Seats: ${selectedSeats.join(", ")}`}
      </p>
      <hr />
      <div className={styles.priceRow}>
        <span>Base fare</span>
        <span>${baseFare}</span>
      </div>
      <div className={styles.priceRow}>
        <span>Seat upgrades</span>
        <span>${seatUpgrade}</span>
      </div>
      <hr />
      <div className={`${styles.priceRow} ${styles.total}`}>
        <span>Total</span>
        <span>${total}</span>
      </div>
    </div>
  );
}
