import styles from "./BookingStepsHeader.module.css";

export default function BookingStepsHeader() {
  return (
    <div className={styles.head}>
      <h1>Complete Your Booking</h1>
      <div className={styles.flow}>
        <div className={styles.stepDone}>
          <span className={styles.numDone}>1</span>
          <span>Search</span>
        </div>
        <div className={styles.stepDone}>
          <span className={styles.numDone}>2</span>
          <span>Seats</span>
        </div>
        <div className={styles.stepCurrent}>
          <span className={styles.numCurrent}>3</span>
          <span>Payment</span>
        </div>
        <div className={styles.stepNext}>
          <span className={styles.numNext}>4</span>
          <span>Confirmation</span>
        </div>
      </div>
    </div>
  );
}
