import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking, getBookingFlow, getPromos } from "../api/client.js";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import BookingStepsHeader from "../components/booking/BookingStepsHeader.jsx";
import PromoCode from "../components/booking/PromoCode.jsx";
import PaymentForm from "../components/booking/PaymentForm.jsx";
import BookingSummaryPanel from "../components/booking/BookingSummaryPanel.jsx";
import BookingTotalsCard from "../components/booking/BookingTotalsCard.jsx";
import ConfirmPaymentModal from "../components/booking/ConfirmPaymentModal.jsx";
import SuccessAlert from "../components/booking/SuccessAlert.jsx";
import styles from "./BookingPage.module.css";
import payStyles from "../components/booking/PaymentForm.module.css";
import promoStyles from "../components/booking/PromoCode.module.css";

export default function BookingPage() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [subtotal, setSubtotal] = useState("0.00");
  const [discount, setDiscount] = useState("0.00");
  const [total, setTotal] = useState("0.00");

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoInputClass, setPromoInputClass] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOk, setNameOk] = useState(false);
  const [cardOk, setCardOk] = useState(false);
  const [expiryOk, setExpiryOk] = useState(false);
  const [cvvOk, setCvvOk] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [cardErr, setCardErr] = useState("");
  const [expiryErr, setExpiryErr] = useState("");
  const [cvvErr, setCvvErr] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const flow = await getBookingFlow();
      if (cancelled) return;
      // if (!flow?.bookingData) {
      //   navigate("/", { replace: true });
      //   return;
      // }
      const b = flow.bookingData;
      setBookingData(b);
      const t = Number(b.totalPrice).toFixed(2);
      setSubtotal(t);
      setTotal(t);
      setDiscount("0.00");
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const payReady = nameOk && cardOk && expiryOk && cvvOk;

  function onNameInput(e) {
    const v = e.target.value;
    setCardName(v);
    if (v.trim().length < 3) {
      setNameErr("Enter a valid name");
      setNameOk(false);
    } else {
      setNameErr("");
      setNameOk(true);
    }
  }

  function onCardInput(e) {
    let value = e.target.value.replace(/\D/g, "").substring(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNum(value);
    if (value.replace(/\s/g, "").length < 16) {
      setCardErr("Card number must be 16 digits");
      setCardOk(false);
    } else {
      setCardErr("");
      setCardOk(true);
    }
  }

  function onExpiryInput(e) {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (value.length >= 3) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setExpiry(value);
    if (value.length < 5) {
      setExpiryErr("Enter valid date (MM/YY)");
      setExpiryOk(false);
      return;
    }
    const [monthStr, yearStr] = value.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear() % 100;
    if (month < 1 || month > 12) {
      setExpiryErr("Month must be 01–12");
      setExpiryOk(false);
      return;
    }
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setExpiryErr("Enter a valid future date (MM/YY)");
      setExpiryOk(false);
      return;
    }
    setExpiryErr("");
    setExpiryOk(true);
  }

  function onCvvInput(e) {
    const value = e.target.value.replace(/\D/g, "").substring(0, 3);
    setCvv(value);
    if (value.length < 3) {
      setCvvErr("CVV must be 3 digits");
      setCvvOk(false);
    } else {
      setCvvErr("");
      setCvvOk(true);
    }
  }

  async function applyPromo() {
    const entered = promoInput.trim().toUpperCase();
    setPromoError("");
    setPromoSuccess("");
    setPromoInputClass("");
    if (!entered) {
      setPromoError("Please enter a promo code");
      setPromoInputClass("err");
      return;
    }
    try {
      const promos = await getPromos();
      const promo = promos.find(
        (p) => p.code.toUpperCase() === entered
      );
      if (!promo) {
        setPromoError("Invalid promo code");
        setPromoInputClass("err");
        return;
      }
      const subtotalValue = parseFloat(subtotal);
      let discountValue =
        promo.type === "percentage"
          ? (subtotalValue * promo.value) / 100
          : promo.value;
      if (discountValue > subtotalValue) discountValue = subtotalValue;
      const finalTotal = subtotalValue - discountValue;
      setDiscount(discountValue.toFixed(2));
      setTotal(finalTotal.toFixed(2));
      setPromoSuccess(
        `✓ $${discountValue.toFixed(2)} off your booking — You save $${discountValue.toFixed(2)}`
      );
      setPromoInputClass("ok");
      setPromoApplied(true);
    } catch {
      setPromoError("Error loading promo data");
      setPromoInputClass("err");
    }
  }

  function openPayModal() {
    if (!bookingData) return;
    setModalOpen(true);
  }

  async function finalizePayment() {
    setModalOpen(false);
    const b = bookingData;
    if (!b) return;

    const finalTotal = parseFloat(total);
    try {
      const { booking: saved } = await createBooking({
        flight: b.flight,
        passengers: b.passengers,
        seats: b.seats,
        totalPrice: finalTotal,
        selectedDate: b.selectedDate,
      });
      setToastOpen(true);
      setTimeout(() => {
        navigate("/confirmation", { state: { booking: saved } });
      }, 1500);
    } catch (e) {
      alert(e.message || "Payment could not be completed.");
    }
  }

  if (!bookingData) return null;

  const {
    flight,
    seats,
    passengers,
    baseFare,
    seatUpgrade,
    selectedDate,
  } = bookingData;

  const promoMod =
    promoInputClass === "err"
      ? promoStyles.inputError
      : promoInputClass === "ok"
        ? promoStyles.inputSuccess
        : "";

  return (
    <>
      <Header />
      <main className={styles.main}>
        <BookingStepsHeader />
        <div className={styles.content}>
          <div className={styles.left}>
            <PromoCode
              value={promoInput}
              onChange={setPromoInput}
              onApply={applyPromo}
              error={promoError}
              success={promoSuccess}
              applied={promoApplied}
              inputClass={promoMod}
            />
            <PaymentForm
              cardName={cardName}
              cardNum={cardNum}
              expiry={expiry}
              cvv={cvv}
              nameError={nameErr}
              cardError={cardErr}
              expiryError={expiryErr}
              cvvError={cvvErr}
              onNameInput={onNameInput}
              onCardInput={onCardInput}
              onExpiryInput={onExpiryInput}
              onCvvInput={onCvvInput}
              nameClass={
                nameOk ? payStyles.inputOk : nameErr ? payStyles.inputBad : ""
              }
              cardClass={
                cardOk ? payStyles.inputOk : cardErr ? payStyles.inputBad : ""
              }
              expiryClass={
                expiryOk ? payStyles.inputOk : expiryErr ? payStyles.inputBad : ""
              }
              cvvClass={
                cvvOk ? payStyles.inputOk : cvvErr ? payStyles.inputBad : ""
              }
            />
          </div>
          <div className={styles.right}>
            <BookingSummaryPanel
              flight={flight}
              seats={seats}
              passengers={passengers}
              baseFare={baseFare}
              seatUpgrade={seatUpgrade}
              selectedDate={selectedDate}
            />
            <BookingTotalsCard
              subtotal={subtotal}
              discount={discount}
              total={total}
            />
            <button
              type="button"
              className={`${styles.payBtn} ${payReady ? styles.payBtnActive : ""}`}
              disabled={!payReady}
              onClick={openPayModal}
            >
              Confirm & Pay
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <ConfirmPaymentModal
        open={modalOpen}
        routeText={`You are about to book a flight from ${flight.from.code} to ${flight.to.code}.`}
        total={total}
        onClose={() => setModalOpen(false)}
        onGoBack={() => setModalOpen(false)}
        onConfirm={finalizePayment}
      />
      <SuccessAlert
        open={toastOpen}
        message="Booking confirmed!"
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
