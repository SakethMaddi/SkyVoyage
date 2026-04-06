import styles from "./BookingSummaryPanel.module.css";

function formatTripDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingSummaryPanel({
  flight,
  seats,
  passengers,
  baseFare,
  seatUpgrade,
  selectedDate,
}) {
  if (!flight) return null;

  const formattedDate = formatTripDate(selectedDate);
  const passengerNames = passengers
    .map((p) => `${p.firstName} ${p.lastName}`)
    .join(", ");

  const stopText =
    flight.stops === 0
      ? "Direct"
      : flight.stops === 1
        ? "1 Stop"
        : `${flight.stops} Stops`;

  const seatList = Array.isArray(seats) ? seats.join(", ") : String(seats);

  return (
    <div className={styles.wrap}>
      <h2>Booking Summary</h2>
      <div className={styles.inner}>
        <div className={styles.route}>
          <div className={styles.codes}>
            <div className={styles.cityBlock}>
              <span className={styles.code}>{flight.from.code}</span>
              <p className={styles.city}>{flight.from.city}</p>
            </div>
            <span className={styles.arrow}>→</span>
            <div className={styles.cityBlock}>
              <span className={styles.code}>{flight.to.code}</span>
              <p className={styles.city}>{flight.to.city}</p>
            </div>
          </div>
          <div className={styles.flightInfo}>
            <p>{flight.airline}</p>
            <p>{formattedDate}</p>
            <p>
              {flight.departureTime} - {flight.arrivalTime}
            </p>
            <p>
              {flight.duration} · {stopText}
            </p>
          </div>
        </div>
        <hr className={styles.line} />
        <p className={styles.label}>SEATS</p>
        <div className={styles.row}>
          <p>{seatList}</p>
          <p>${Number(seatUpgrade).toFixed(2)}</p>
        </div>
        <hr className={styles.line} />
        <p className={styles.label}>
          <strong>PASSENGERS</strong>
        </p>
        <div className={styles.row}>
          <p>{passengerNames}</p>
          <p>{seatList}</p>
        </div>
        <hr className={styles.line} />
        <div className={styles.fairRow}>
          <p className={styles.base}>Base fare</p>
          <p className={styles.base}>${Number(baseFare).toFixed(2)}</p>
        </div>
        <div className={styles.fairRow}>
          <p>Seat upgrade</p>
          <p>${Number(seatUpgrade).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
