import styles from "./SeatMap.module.css";

export default function SeatMap({
  data,
  selectedSeats,
  passengerCount,
  onToggle,
}) {
  if (!data) return null;

  const rows = [];
  for (let row = 1; row <= data.rows; row++) {
    const cells = [];
    data.columns.forEach((col) => {
      const seatNumber = `${row}${col}`;
      const occupied = data.occupied.includes(seatNumber);
      const isBusiness = data.businessRows.includes(row);
      const isExit = data.exitRows.includes(row);
      const isSelected = selectedSeats.includes(seatNumber);

      let seatClass = styles.seat;
      if (occupied) seatClass += ` ${styles.occupied}`;
      else {
        seatClass += ` ${styles.available}`;
        if (isBusiness) seatClass += ` ${styles.business}`;
        if (isExit) seatClass += ` ${styles.exit}`;
        if (isSelected) seatClass += ` ${styles.selected}`;
      }

      cells.push(
        <button
          key={seatNumber}
          type="button"
          className={seatClass}
          disabled={occupied}
          onClick={() => onToggle(seatNumber)}
        >
          {col}
        </button>
      );

      if (data.aisleAfter.includes(col)) {
        cells.push(<div key={`aisle-${row}-${col}`} className={styles.aisleGap} />);
      }
    });

    rows.push(
      <div key={row} className={styles.row}>
        <div className={styles.rowNumber}>{row}</div>
        {cells}
      </div>
    );
  }

  return <div className={styles.container}>{rows}</div>;
}
