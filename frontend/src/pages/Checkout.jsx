import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPromos, postBooking } from "../services/api";

function loadBookingData() {
  try {
    return JSON.parse(localStorage.getItem("bookingData") || "null");
  } catch {
    return null;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const [cardName, setCardName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [nameErr, setNameErr] = useState("");
  const [cardErr, setCardErr] = useState("");
  const [expErr, setExpErr] = useState("");
  const [cvvErr, setCvvErr] = useState("");

  const [nameOk, setNameOk] = useState(false);
  const [cardOk, setCardOk] = useState(false);
  const [expOk, setExpOk] = useState(false);
  const [cvvOk, setCvvOk] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [payBusy, setPayBusy] = useState(false);

  useEffect(() => {
    const b = loadBookingData();
    if (!b?.flight) {
      navigate("/");
      return;
    }
    setBooking(b);
    const sub = Number(b.totalPrice) || 0;
    setSubtotal(sub);
    setTotal(sub);
    setDiscount(0);
  }, [navigate]);

  const applyPromo = async () => {
    const entered = promoInput.trim().toUpperCase();
    setPromoError("");
    setPromoSuccess("");
    if (!entered) {
      setPromoError("Please enter a promo code");
      return;
    }
    try {
      const promos = await getPromos();
      const promo = promos.find(
        (p) => p.code.toUpperCase() === entered
      );
      if (!promo) {
        setPromoError("Invalid promo code");
        return;
      }
      let disc =
        promo.type === "percentage"
          ? (subtotal * promo.value) / 100
          : promo.value;
      if (disc > subtotal) disc = subtotal;
      const finalTotal = subtotal - disc;
      setDiscount(disc);
      setTotal(finalTotal);
      setPromoSuccess(
        `✓ $${disc.toFixed(2)} off your booking — You save $${disc.toFixed(2)}`
      );
      setPromoApplied(true);
    } catch {
      setPromoError("Error loading promo data");
    }
  };

  const checkPayValid =
    nameOk && cardOk && expOk && cvvOk && booking && !payBusy;

  const onName = (v) => {
    setCardName(v);
    if (v.trim().length < 3) {
      setNameErr("Enter a valid name");
      setNameOk(false);
    } else {
      setNameErr("");
      setNameOk(true);
    }
  };

  const onCard = (raw) => {
    let value = raw.replace(/\D/g, "").substring(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNum(value);
    if (value.replace(/\s/g, "").length < 16) {
      setCardErr("Card number must be 16 digits");
      setCardOk(false);
    } else {
      setCardErr("");
      setCardOk(true);
    }
  };

  const onExp = (raw) => {
    let value = raw.replace(/\D/g, "").substring(0, 4);
    if (value.length >= 3) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }
    setCardExp(value);
    if (value.length < 5) {
      setExpErr("Enter valid date (MM/YY)");
      setExpOk(false);
      return;
    }
    const [monthStr, yearStr] = value.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear() % 100;
    if (month < 1 || month > 12) {
      setExpErr("Month must be 01–12");
      setExpOk(false);
      return;
    }
    if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      setExpErr("Enter a valid future date (MM/YY)");
      setExpOk(false);
      return;
    }
    setExpErr("");
    setExpOk(true);
  };

  const onCvv = (raw) => {
    const value = raw.replace(/\D/g, "").substring(0, 3);
    setCardCvv(value);
    if (value.length < 3) {
      setCvvErr("CVV must be 3 digits");
      setCvvOk(false);
    } else {
      setCvvErr("");
      setCvvOk(true);
    }
  };

  const summaryDetails = useCallback(() => {
    if (!booking) return null;
    const { flight, seats, passengers, baseFare, seatUpgrade, selectedDate } =
      booking;
    const formattedDate = selectedDate
      ? new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";
    const passengerNames = passengers
      .map((p) => `${p.firstName} ${p.lastName}`)
      .join(", ");
    const seatType =
      seatUpgrade === 80
        ? "Business"
        : seatUpgrade === 40
          ? "Exit Row"
          : "Economy";
    const stopText =
      flight.stops === 0
        ? "Direct"
        : flight.stops === 1
          ? "1 Stop"
          : `${flight.stops} Stops`;

    return (
      <div className="summary-details">
        <div className="route-section">
          <div className="route-codes">
            <div className="route_from">
              <span className="airport-code">{flight.from.code}</span>
              <p className="city-names">{flight.from.city}</p>
            </div>
            <span className="arrow">→</span>
            <div className="route_from">
              <span className="airport-code">{flight.to.code}</span>
              <p className="city-names">{flight.to.city}</p>
            </div>
          </div>
          <div className="flight-info">
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
        <hr className="booking_line" />
        <p className="booked_seat">SEATS</p>
        <div className="seat_fair">
          <p>
            {Array.isArray(seats) ? seats.join(", ") : seats} ({seatType})
          </p>
          <p>${Number(seatUpgrade).toFixed(2)}</p>
        </div>
        <hr className="booking_line" />
        <p className="booked_seat">
          <strong>PASSANGERS</strong>
        </p>
        <div className="seat_fair">
          <p>{passengerNames}</p>
          <p>{Array.isArray(seats) ? seats.join(", ") : seats}</p>
        </div>
        <hr className="booking_line" />
        <div className="booking_fairs">
          <p className="base_fair">Base fare</p>
          <p className="base_fair">${Number(baseFare).toFixed(2)}</p>
        </div>
        <div className="booking_fairs">
          <p>Seat upgrade</p>
          <p>${Number(seatUpgrade).toFixed(2)}</p>
        </div>
      </div>
    );
  }, [booking]);

  const confirmPay = async () => {
    setModalOpen(false);
    setPayBusy(true);
    await new Promise((r) => setTimeout(r, 2000));
    const b = loadBookingData();
    if (b) {
      try {
        await postBooking({
          flight: b.flight,
          passengers: b.passengers,
          seats: b.seats,
          baseFare: b.baseFare,
          seatUpgrade: b.seatUpgrade,
          totalPrice: total,
          selectedDate: b.selectedDate,
        });
      } catch {
        /* Mongo optional */
      }
    }
    setSuccessAlert(true);
    setPayBusy(false);
    const latest = loadBookingData();
    if (latest) {
      localStorage.setItem(
        "bookingData",
        JSON.stringify({ ...latest, totalPrice: total })
      );
    }
    setTimeout(() => navigate("/confirmation"), 1500);
  };

  if (!booking) return null;

  return (
    <>
      <Header />
      <main className="bookings_main">
        <div className="bookings_head">
          <h1>Complete Your Booking</h1>
          <div className="booking_flow">
            <div className="booking_step">
              <span className="booking_step_n">1</span>
              <span className="booking_step_p">Search</span>
            </div>
            <div className="booking_step">
              <span className="booking_step_n">2</span>
              <span className="booking_step_p">Seats</span>
            </div>
            <div className="booking_step_pym">
              <span className="booking_step_pn">3</span>
              <span className="booking_step_pp">Payment</span>
            </div>
            <div className="booking_step_cnfm">
              <span className="booking_step_cn">4</span>
              <span className="booking_step_cp">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="Booking_content">
          <div className="booking_content_left">
            <div className="booking_promoCode">
              <h2>Promo Code</h2>
              <div className="promo_in_btn">
                <input
                  type="text"
                  className={`promo_input${promoError ? " input-error" : ""}${promoSuccess ? " input-success" : ""}`}
                  placeholder="ENTER PROMO CODE"
                  value={promoInput}
                  disabled={promoApplied}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button
                  type="button"
                  className="promo_btn"
                  onClick={applyPromo}
                  disabled={promoApplied}
                >
                  {promoApplied ? "Applied" : "Apply"}
                </button>
              </div>
              {promoError && (
                <small className="error_msg" style={{ display: "block" }}>
                  {promoError}
                </small>
              )}
              {promoSuccess && (
                <small className="success_msg" style={{ display: "block" }}>
                  {promoSuccess}
                </small>
              )}
            </div>
            <div className="booking_paymentDetails">
              <h2>Payment details</h2>
              <div className="booking_payment">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                  type="text"
                  className={`card_name${nameErr ? " input-error" : ""}${nameOk ? " input-success" : ""}`}
                  id="cardName"
                  placeholder="NAME ON CARD"
                  value={cardName}
                  onChange={(e) => onName(e.target.value)}
                />
                {nameErr && (
                  <small className="error_msg" style={{ display: "block" }}>
                    {nameErr}
                  </small>
                )}
              </div>
              <div className="booking_payment">
                <label htmlFor="cardNum">Card Number</label>
                <input
                  type="text"
                  className={`card_name${cardErr ? " input-error" : ""}${cardOk ? " input-success" : ""}`}
                  id="cardNum"
                  placeholder="1234 5678 9101 1234"
                  value={cardNum}
                  onChange={(e) => onCard(e.target.value)}
                />
                {cardErr && (
                  <small className="error_msg" style={{ display: "block" }}>
                    {cardErr}
                  </small>
                )}
              </div>
              <div className="exp_cvv">
                <div className="booking_payment">
                  <label htmlFor="card_exp">Expiry Date</label>
                  <input
                    type="text"
                    className={`card_name${expErr ? " input-error" : ""}${expOk ? " input-success" : ""}`}
                    id="card_exp"
                    placeholder="MM/YY"
                    value={cardExp}
                    onChange={(e) => onExp(e.target.value)}
                  />
                  {expErr && (
                    <small className="error_msg" style={{ display: "block" }}>
                      {expErr}
                    </small>
                  )}
                </div>
                <div className="booking_payment">
                  <label htmlFor="card_cvv">CVV</label>
                  <input
                    type="text"
                    className={`card_name${cvvErr ? " input-error" : ""}${cvvOk ? " input-success" : ""}`}
                    id="card_cvv"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => onCvv(e.target.value)}
                  />
                  {cvvErr && (
                    <small className="error_msg" style={{ display: "block" }}>
                      {cvvErr}
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="booking_right_div">
            <div className="booking_content_right">
              <div>
                <h2>Booking Summary</h2>
                <div className="booking_summary_box">
                  {summaryDetails()}
                  <div className="booking_fairs">
                    <p>Subtotal</p>
                    <p>
                      $<span id="subtotal">{subtotal.toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="booking_fairs">
                    <p className="discount_fair">Discount</p>
                    <p>
                      $<span id="discount">{discount.toFixed(2)}</span>
                    </p>
                  </div>
                  <hr />
                  <div className="booking_fairs_final">
                    <h3>Total</h3>
                    <h3>
                      $<span id="total">{total.toFixed(2)}</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className={`booking_pay_btn${checkPayValid ? " active" : ""}`}
              id="payBtn"
              disabled={!checkPayValid}
              onClick={() => setModalOpen(true)}
            >
              {payBusy ? "⏳ Processing payment..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      </main>
      <Footer />

      <div
        className={`modal_overlay${modalOpen ? " active" : ""}`}
        id="confirmModal"
        role="presentation"
        onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
      >
        <div className="modal_box">
          <div className="modal_header">
            <h3>Confirm Booking</h3>
            <button
              type="button"
              className="modal_close"
              id="closeModal"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="modal_body">
            <p id="modalRouteText">
              You are about to book a flight from {booking.flight.from.code} to{" "}
              {booking.flight.to.code}.
            </p>
            <p>
              Total charge:{" "}
              <strong>
                $<span id="modalTotal">{total.toFixed(2)}</span>
              </strong>
            </p>
          </div>
          <div className="modal_actions">
            <button
              type="button"
              className="modal_back_btn"
              id="goBackBtn"
              onClick={() => setModalOpen(false)}
            >
              Go Back
            </button>
            <button
              type="button"
              className="modal_confirm_btn"
              id="finalConfirmBtn"
              onClick={confirmPay}
            >
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>

      <div className={`success_alert${successAlert ? " active" : ""}`}>
        <span>✔ Booking confirmed!</span>
        <button
          type="button"
          className="close_alert"
          onClick={() => setSuccessAlert(false)}
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </>
  );
}
