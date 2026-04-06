import { useState } from "react";
import styles from "./BookingHistoryItem.module.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingHistoryItem({ booking }) {
  const [open, setOpen] = useState(false);
  const formattedDate = formatDate(booking.selectedDate);
  const { flight, reference, passengers, seats, totalPrice } = booking;
  const seatList = Array.isArray(seats) ? seats : [seats];

  return (
    <div
      className={styles.item}
      role="button"
      tabIndex={0}
      onClick={() => setOpen((o) => !o)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((o) => !o);
        }
      }}
    >
      <div className={styles.summary}>
        <h3>
          {flight.from.code} → {flight.to.code}
        </h3>
        <p>
          <span>{reference}</span>
        </p>
        <p>{formattedDate}</p>
        <p>${Number(totalPrice).toFixed(2)}</p>
      </div>
      <div className={`${styles.details} ${open ? styles.detailsOpen : ""}`}>
        <div className={styles.block}>
          <h4>Flight Details</h4>
          <p>
            <strong>Airline:</strong> {flight.airline}
          </p>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Time:</strong> {flight.departureTime} - {flight.arrivalTime}
          </p>
          <p>
            <strong>Duration:</strong> {flight.duration}
          </p>
          <p>
            <strong>Stops:</strong> {flight.stops}
          </p>
        </div>
        <div className={styles.block}>
          <h4>Passengers</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Seat</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((p, index) => (
                <tr key={index}>
                  <td>
                    {p.firstName} {p.lastName}
                  </td>
                  <td>{p.email}</td>
                  <td>{seatList[index] ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
