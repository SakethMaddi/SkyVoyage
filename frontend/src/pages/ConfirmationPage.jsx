import { Link, useLocation, Navigate } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import styles from "./ConfirmationPage.module.css";

export default function ConfirmationPage() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const { reference, flight, passengers, seats, totalPrice, selectedDate } =
    booking;

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const passengerNames = passengers
    .map((p) => `${p.firstName} ${p.lastName}`)
    .join(", ");

  const seatLabel = Array.isArray(seats) ? seats.join(", ") : String(seats);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.tick}>✓</div>
          <h1 className={styles.title}>Booking Confirmed!</h1>
          <p className={styles.sub}>Thank you for choosing SkyVoyage.</p>
          <div className={styles.ref}>
            <p>BOOKING REFERENCE</p>
            <h2>{reference}</h2>
          </div>
          <h2 className={styles.route}>
            {flight.from.code} ({flight.from.city}) → {flight.to.code} (
            {flight.to.city})
          </h2>
          <p className={styles.flightMeta}>
            {flight.airline} | {formattedDate} | {flight.departureTime} -{" "}
            {flight.arrivalTime}
          </p>
          <div className={styles.passengers}>
            <h3>Passengers</h3>
            <div className={styles.passengerRow}>
              <span>{passengerNames}</span>
              <span>Seats {seatLabel}</span>
            </div>
          </div>
          <div className={styles.payment}>
            <h3>Total Paid</h3>
            <h2>${Number(totalPrice).toFixed(2)}</h2>
          </div>
          <div className={styles.actions}>
            <Link to="/history" className={styles.primary}>
              View My Bookings
            </Link>
            <Link to="/" className={styles.secondary}>
              Search More Flights
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
