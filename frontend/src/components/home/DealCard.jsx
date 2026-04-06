import styles from "./DealCard.module.css";

export default function DealCard({ deal, bgColor, flightTotal, onSelect }) {
  return (
    <button
      type="button"
      className={styles.dealCard}
      style={{ backgroundColor: bgColor }}
      onClick={() => onSelect(deal.from.code, deal.to.code)}
    >
      <div className={styles.cardTop}>
        <span className={styles.tag}>{deal.tag}</span>
        <h2>
          {deal.from.city} → {deal.to.city}
        </h2>
        <p>
          {deal.from.code} — {deal.to.code}
        </p>
      </div>
      <div className={styles.cardBottom}>
        <h3>From ${deal.price.economy}</h3>
        <p>{flightTotal} flights daily</p>
      </div>
    </button>
  );
}
