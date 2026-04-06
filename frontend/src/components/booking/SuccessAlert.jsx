import styles from "./SuccessAlert.module.css";

export default function SuccessAlert({ open, message, onClose }) {
  if (!open) return null;

  return (
    <div className={styles.alert}>
      <span>✔ {message}</span>
      <button type="button" className={styles.close} onClick={onClose}>
        ×
      </button>
    </div>
  );
}
