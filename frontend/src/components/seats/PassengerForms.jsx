import styles from "./PassengerForms.module.css";

export default function PassengerForms({
  count,
  passengers,
  onChange,
  onSubmit,
}) {
  function update(index, field, value) {
    const next = [...passengers];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  }

  return (
    <form onSubmit={onSubmit}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.card}>
          <h3>Passenger {i + 1}</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <p>First Name</p>
              <input
                value={passengers[i]?.firstName || ""}
                onChange={(e) => update(i, "firstName", e.target.value)}
                placeholder="e.g. John"
                required
              />
            </div>
            <div className={styles.field}>
              <p>Last Name</p>
              <input
                value={passengers[i]?.lastName || ""}
                onChange={(e) => update(i, "lastName", e.target.value)}
                placeholder="e.g. Doe"
                required
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <p>Email</p>
              <input
                type="email"
                value={passengers[i]?.email || ""}
                onChange={(e) => update(i, "email", e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <p>Phone</p>
              <input
                value={passengers[i]?.phone || ""}
                onChange={(e) => update(i, "phone", e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <p>Passport Number</p>
              <input
                value={passengers[i]?.passport || ""}
                onChange={(e) => update(i, "passport", e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <p>Date of Birth</p>
              <input
                type="date"
                value={passengers[i]?.dob || ""}
                onChange={(e) => update(i, "dob", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      ))}
      <button type="submit" className={styles.submit}>
        Continue to Booking
      </button>
    </form>
  );
}
