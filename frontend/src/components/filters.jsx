// src/components/Filters.jsx

import styles from "../styles/Filters.module.css";

export default function Filters({ filters, setFilters }) {
  return (
    <div className={styles.sidebar}>
      <h3>Filters</h3>

      {/* PRICE */}
      <div className={styles.group}>
        <label>Max Price ($)</label>
        <input
          type="number"
          value={filters.price}
          onChange={(e) =>
            setFilters({ ...filters, price: Number(e.target.value) })
          }
        />
      </div>

      {/* DURATION */}
      <div className={styles.group}>
        <label>Max Duration (hrs)</label>
        <input
          type="number"
          value={filters.duration}
          onChange={(e) =>
            setFilters({ ...filters, duration: Number(e.target.value) })
          }
        />
      </div>
    </div>
  );
}