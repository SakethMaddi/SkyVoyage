import styles from "./PaymentForm.module.css";

export default function PaymentForm({
  cardName,
  cardNum,
  expiry,
  cvv,
  nameError,
  cardError,
  expiryError,
  cvvError,
  onNameInput,
  onCardInput,
  onExpiryInput,
  onCvvInput,
  nameClass = "",
  cardClass = "",
  expiryClass = "",
  cvvClass = "",
}) {
  return (
    <div className={styles.box}>
      <h2>Payment details</h2>
      <div className={styles.field}>
        <label htmlFor="cardName">Cardholder Name</label>
        <input
          id="cardName"
          className={`${styles.input} ${nameClass}`}
          placeholder="NAME ON CARD"
          value={cardName}
          onChange={onNameInput}
        />
        <small className={styles.error} style={{ display: nameError ? "block" : "none" }}>
          {nameError}
        </small>
      </div>
      <div className={styles.field}>
        <label htmlFor="cardNum">Card Number</label>
        <input
          id="cardNum"
          className={`${styles.input} ${cardClass}`}
          placeholder="1234 5678 9101 1234"
          value={cardNum}
          onChange={onCardInput}
        />
        <small className={styles.error} style={{ display: cardError ? "block" : "none" }}>
          {cardError}
        </small>
      </div>
      <div className={styles.expRow}>
        <div className={styles.field}>
          <label htmlFor="card_exp">Expiry Date</label>
          <input
            id="card_exp"
            className={`${styles.input} ${expiryClass}`}
            placeholder="MM/YY"
            value={expiry}
            onChange={onExpiryInput}
          />
          <small className={styles.error} style={{ display: expiryError ? "block" : "none" }}>
            {expiryError}
          </small>
        </div>
        <div className={styles.field}>
          <label htmlFor="card_cvv">CVV</label>
          <input
            id="card_cvv"
            className={`${styles.input} ${cvvClass}`}
            placeholder="123"
            value={cvv}
            onChange={onCvvInput}
          />
          <small className={styles.error} style={{ display: cvvError ? "block" : "none" }}>
            {cvvError}
          </small>
        </div>
      </div>
    </div>
  );
}
