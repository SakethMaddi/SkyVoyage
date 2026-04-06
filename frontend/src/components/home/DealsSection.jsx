import DealCard from "./DealCard.jsx";
import styles from "./DealsSection.module.css";

const DEAL_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#eab308",
  "#ec4899",
];

function countFlights(fromCity, toCity, flights) {
  return flights.filter(
    (f) => f.from.city === fromCity && f.to.city === toCity
  ).length;
}

export default function DealsSection({ flights, deals, onDealSelect, error }) {
  if (error) {
    return (
      <section className={styles.section}>
        <p className={styles.error}>{error}</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>Popular Destinations</h2>
      <p className={styles.subtitle}>
        Explore trending routes with great deals
      </p>
      <div className={styles.container}>
        {deals.map((deal, index) => (
          <DealCard
            key={`${deal.from.code}-${deal.to.code}-${index}`}
            deal={deal}
            bgColor={DEAL_COLORS[index % DEAL_COLORS.length]}
            flightTotal={countFlights(deal.from.city, deal.to.city, flights)}
            onSelect={onDealSelect}
          />
        ))}
      </div>
    </section>
  );
}
