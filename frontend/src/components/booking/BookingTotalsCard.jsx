import styles from "./BookingTotalsCard.module.css";

export default function BookingTotalsCard({ subtotal, discount, total }) {
  return (
    <div className={styles.box}>
      <div className={styles.row}>
        <p>Subtotal</p>
        <p>
          $<span>{subtotal}</span>
        </p>
      </div>
      <div className={styles.row}>
        <p className={styles.discount}>Discount</p>
        <p>
          $<span>{discount}</span>
        </p>
      </div>
      <hr />
      <div className={styles.final}>
        <h3>Total</h3>
        <h3>
          $<span>{total}</span>
        </h3>
      </div>
    </div>
  );
}
