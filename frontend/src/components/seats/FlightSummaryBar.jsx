import styles from "./FlightSummaryBar.module.css";

export default function FlightSummaryBar({ flight }) {
  if (!flight) return null;
  const stopLabel =
    flight.stops === 0 ? "Direct" : flight.stops === 1 ? "1 Stop" : `${flight.stops} Stops`;
  return (
    <div className={styles.summary}>
      {flight.from.code} → {flight.to.code} • {flight.airline} • {flight.duration} •{" "}
      {flight.departureTime} - {flight.arrivalTime} • {stopLabel}
    </div>
  );
}
