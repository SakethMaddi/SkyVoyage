import styles from "./PromoCode.module.css";

export default function PromoCode({
  value,
  onChange,
  onApply,
  error,
  success,
  applied,
  inputClass,
}) {
  return (
    <div className={styles.box}>
      <h2>Promo Code</h2>
      <div className={styles.row}>
        <input
          type="text"
          className={`${styles.input} ${inputClass || ""}`}
          placeholder="ENTER PROMO CODE"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          disabled={applied}
        />
        <button
          type="button"
          className={styles.btn}
          onClick={onApply}
          disabled={applied}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
      {error && (
        <small className={styles.error}>{error}</small>
      )}
      {success && (
        <small className={styles.success}>{success}</small>
      )}
    </div>
  );
}
