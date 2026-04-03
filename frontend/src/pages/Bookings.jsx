import { useLocation } from "react-router-dom";
import "../styles/booking.css";

export default function Bookings() {
  const location = useLocation();

  const { flight, passengers, selectedSeats, passengerDetails } =
    location.state || {};

  return (
    <div className="booking-page">

    <h1 className="title">Complete Your Booking</h1>

    {/* STEP INDICATOR */}
    <div className="steps">
      <span className="done">1 Search</span>
      <span className="done">2 Seats</span>
      <span className="active">3 Payment</span>
      <span>4 Confirmation</span>
    </div>

    <div className="booking-container">

      {/* LEFT SIDE */}
      <div className="left-section">

        {/* PROMO */}
        <div className="card">
          <h3>Promo Code</h3>
          <div className="promo-box">
            <input placeholder="ENTER PROMO CODE" />
            <button>Apply</button>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="card">
          <h3>Payment Details</h3>

          <label>Cardholder Name</label>
          <input placeholder="Name on card" />

          <label>Card Number</label>
          <input placeholder="1234 5678 9012 3456" />

          <div className="row">
            <div>
              <label>Expiry Date</label>
              <input placeholder="MM/YY" />
            </div>

            <div>
              <label>CVV</label>
              <input placeholder="123" />
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">

        <div className="card">

          <h3>Booking Summary</h3>

          <h2>
            {flight?.from?.code} → {flight?.to?.code}
          </h2>

          <p>{flight?.airline}</p>
          <p>{flight?.departureTime} - {flight?.arrivalTime}</p>

          <hr />

          <p><b>Seats:</b> {selectedSeats?.join(", ")}</p>

          <div>
            <b>Passengers:</b>
            {passengerDetails?.map((p, i) => (
              <p key={i}>
                {p.firstName} {p.lastName}
              </p>
            ))}
          </div>

          <hr />

          <p>
            Base fare: $
            {flight?.price?.economy}
          </p>

          <h3 className="total">
            Total: $
            {(selectedSeats?.length || 0) *
              (flight?.price?.economy || 0)}
          </h3>

        </div>

        <button className="pay-btn">
          Confirm & Pay
        </button>

      </div>

    </div>
  </div>
  );
}