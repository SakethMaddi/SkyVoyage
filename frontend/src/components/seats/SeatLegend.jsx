import styles from "./SeatLegend.module.css";

export default function SeatLegend() {
  return (
    <div className={styles.legend}>
      <div>
        <span className={`${styles.box} ${styles.available}`} /> Available
      </div>
      <div>
        <span className={`${styles.box} ${styles.selected}`} /> Selected
      </div>
      <div>
        <span className={`${styles.box} ${styles.occupied}`} /> Occupied
      </div>
      <div>
        <span className={`${styles.box} ${styles.business}`} /> Business
      </div>
      <div>
        <span className={`${styles.box} ${styles.exit}`} /> Exit Row
      </div>
    </div>
  );
}
