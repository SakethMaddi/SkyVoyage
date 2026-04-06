import { useEffect, useState } from "react";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import BookingHistoryItem from "../components/history/BookingHistoryItem.jsx";
import { getMyBookings } from "../api/client.js";
import styles from "./HistoryPage.module.css";

export default function HistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getMyBookings();
        if (!cancelled) setBookings(list);
      } catch {
        if (!cancelled) {
          setError("Could not load bookings.");
          setBookings([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>My Bookings</h1>
          {error && <p className={styles.empty}>{error}</p>}
          {!error && bookings.length === 0 && (
            <p className={styles.empty}>You have no past bookings.</p>
          )}
          {!error &&
            bookings.map((b, i) => (
              <BookingHistoryItem key={`${b.reference}-${i}`} booking={b} />
            ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
