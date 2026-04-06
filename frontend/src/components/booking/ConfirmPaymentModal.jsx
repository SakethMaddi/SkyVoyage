import styles from "./ConfirmPaymentModal.module.css";

export default function ConfirmPaymentModal({
  open,
  routeText,
  total,
  onClose,
  onGoBack,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <div className={styles.header}>
          <h3>Confirm payment</h3>
          <button type="button" className={styles.close} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.body}>
          <p>{routeText}</p>
          <p className={styles.total}>
            Total: <strong>${total}</strong>
          </p>
          <p className={styles.note}>
            You will receive a confirmation email after payment completes.
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.back} onClick={onGoBack}>
            Go back
          </button>
          <button type="button" className={styles.confirm} onClick={onConfirm}>
            Pay now
          </button>
        </div>
      </div>
    </div>
  );
}
