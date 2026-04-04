import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function generateBookingReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = (len) =>
    Array.from(
      { length: len },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  return `SKV-${random(6)}-${random(4)}`;
}

export default function Confirmation() {
  const [reference, setReference] = useState("");
  const [locationLine, setLocationLine] = useState("");
  const [flightLine, setFlightLine] = useState("");
  const [passengerBlock, setPassengerBlock] = useState(null);
  const [totalPaid, setTotalPaid] = useState("");

  useEffect(() => {
    let bookingData;
    try {
      bookingData = JSON.parse(localStorage.getItem("bookingData") || "null");
    } catch {
      bookingData = null;
    }
    if (!bookingData?.flight) return;

    const {
      flight,
      passengers,
      seats,
      totalPrice,
      selectedDate,
    } = bookingData;
    const ref = generateBookingReference();
    setReference(ref);

    const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const passengerNames = passengers
      .map((p) => `${p.firstName} ${p.lastName}`)
      .join(", ");

    setLocationLine(
      `${flight.from.code} (${flight.from.city}) → ${flight.to.code} (${flight.to.city})`
    );
    setFlightLine(
      `${flight.airline} | ${formattedDate} | ${flight.departureTime} - ${flight.arrivalTime}`
    );
    setPassengerBlock(
      <>
        <h3>Passengers</h3>
        <div className="passenger-row">
          <span>{passengerNames}</span>
          <span>Seat {Array.isArray(seats) ? seats.join(", ") : seats}</span>
        </div>
      </>
    );
    setTotalPaid(Number(totalPrice).toFixed(2));

    const finalBooking = {
      reference: ref,
      flight,
      passengers,
      seats,
      totalPrice,
      selectedDate,
    };
    const allBookings = JSON.parse(
      localStorage.getItem("allBookings") || "[]"
    );
    allBookings.push(finalBooking);
    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    localStorage.removeItem("bookingData");
  }, []);

  return (
    <div className="cnfm-page">
      <Header />
      <main className="cnf-main">
        <div className="cnf-confirmationcard">
          <div className="cnfm-tickmark">✓</div>
          <div className="cnfm-booking-details">
            <h1 className="cnfm-firstline">Booking Confirmed!</h1>
            <h1 className="cnfm-secondline">
              Your flight has been booked successfully
            </h1>
          </div>
          <div className="cnfm-booking-reference">
            <p>BOOKING REFERENCE</p>
            <h2>{reference}</h2>
          </div>
          <h1 className="cnfm-location-details">{locationLine}</h1>
          <h1 className="cnfm-flight-details">{flightLine}</h1>
          <div className="cnfm-passenger-details">{passengerBlock}</div>
          <div className="cnfm-payment-details">
            <h3>Total Paid</h3>
            <h2>${totalPaid}</h2>
          </div>
          <div className="cnfm-end-buttons">
            <Link to="/bookings" className="cnfm-View-My-bookings">
              View My Bookings
            </Link>
            <Link to="/" className="cnfm-Search-more-Flights">
              Search More Flights
            </Link>
          </div>
        </div>
      </main>
      <footer className="cnfm-footer_section">
        <p>&copy; 2026 SkyVoyage. All rights reserved.</p>
      </footer>
    </div>
  );
}
