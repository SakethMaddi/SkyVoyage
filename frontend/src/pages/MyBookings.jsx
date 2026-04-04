import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getBookingsFromServer } from "../services/api";

export default function MyBookings() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("allBookings") || "[]");
    let cancelled = false;
    (async () => {
      try {
        const server = await getBookingsFromServer();
        if (cancelled) return;
        const list = Array.isArray(server) ? server : [];
        const normalized = list.map((b, i) => ({
          reference: b._id != null ? String(b._id) : `DB-${i}`,
          flight: b.flight,
          passengers: b.passengers,
          seats: b.seats,
          totalPrice: b.totalPrice,
          selectedDate: b.selectedDate,
          fromServer: true,
        }));
        const merged = [...normalized, ...local];
        setItems(merged);
      } catch {
        if (!cancelled) setItems(local);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="history_section">
          <h2>My Bookings</h2>
          <div id="bookingHistoryContainer" className="booking-history-container">
            {items.length === 0 && <p>You have no past bookings.</p>}
            {items.map((booking, idx) => (
              <BookingItem key={`${booking.reference}-${idx}`} booking={booking} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function BookingItem({ booking }) {
  const [open, setOpen] = useState(false);
  const formattedDate = booking.selectedDate
    ? new Date(booking.selectedDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const seats = booking.seats;
  const passengerRows = booking.passengers.map((p, index) => (
    <tr key={index}>
      <td>
        {p.firstName} {p.lastName}
      </td>
      <td>{p.email}</td>
      <td>{Array.isArray(seats) ? seats[index] ?? seats[0] : seats}</td>
    </tr>
  ));

  return (
    <div
      className="booking-item"
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
      <h3>
        {booking.flight.from.code} → {booking.flight.to.code}
      </h3>
      <p>
        <span>{booking.reference}</span>
      </p>
      <p>{formattedDate}</p>
      <p>${Number(booking.totalPrice).toFixed(2)}</p>
      <div className={`booking-details${open ? " active" : ""}`}>
        <div className="flight-details">
          <h4>Flight Details</h4>
          <p>
            <strong>Airline:</strong> {booking.flight.airline}
          </p>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Time:</strong> {booking.flight.departureTime} -{" "}
            {booking.flight.arrivalTime}
          </p>
          <p>
            <strong>Duration:</strong> {booking.flight.duration}
          </p>
          <p>
            <strong>Stops:</strong> {booking.flight.stops}
          </p>
        </div>
        <div className="passenger-details">
          <h4>Passengers</h4>
          <table className="passenger-table" border="1" cellSpacing="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Seat</th>
              </tr>
            </thead>
            <tbody>{passengerRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
