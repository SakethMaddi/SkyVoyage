import { useMemo, useState } from "react";
import { todayIsoDate } from "../../utils/formatters.js";
import styles from "./FlightSearchForm.module.css";

function filterAirports(airports, q) {
  if (!q.trim()) return [];
  const up = q.trim().toUpperCase();
  return airports
    .filter(
      (a) =>
        a.code.includes(up) ||
        a.city.toUpperCase().includes(up) ||
        a.name.toUpperCase().includes(up)
    )
    .slice(0, 8);
}

export default function FlightSearchForm({
  airports,
  onSearch,
  initialFrom = "",
  initialTo = "",
}) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(todayIsoDate());
  const [passengers, setPassengers] = useState("1");
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);

  const fromSuggestions = useMemo(
    () => filterAirports(airports, from),
    [airports, from]
  );
  const toSuggestions = useMemo(
    () => filterAirports(airports, to),
    [airports, to]
  );

  function swap() {
    const a = from;
    setFrom(to);
    setTo(a);
  }

  function submit(e) {
    e.preventDefault();
    const fromValue = from.trim().toUpperCase();
    const toValue = to.trim().toUpperCase();
    let departureDate = date;
    if (!fromValue || !toValue) {
      alert("Please enter both From and To airports");
      return;
    }
    if (!departureDate) {
      departureDate = todayIsoDate();
      setDate(departureDate);
    }
    onSearch(fromValue, toValue, departureDate, Number(passengers));
  }

  return (
    <section className={styles.hero}>
      <h1>Where will you fly next?</h1>
      <p className={styles.subtitle}>
        Search thousands of flights and find the best deals
      </p>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.row}>
          <div className={styles.fieldWrap}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="fromInput">
                From
              </label>
              <input
                id="fromInput"
                className={styles.input}
                placeholder="City or Airport"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onFocus={() => setFromFocus(true)}
                onBlur={() => setTimeout(() => setFromFocus(false), 200)}
                autoComplete="off"
              />
            </div>
            {fromFocus && fromSuggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {fromSuggestions.map((a) => (
                  <li
                    key={a.code}
                    role="option"
                    onMouseDown={() => setFrom(a.code)}
                  >
                    {a.code} — {a.city}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className={styles.switchBtn}
            onClick={swap}
            aria-label="Swap from and to"
          >
            <span className={styles.arrowIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="2"
              >
                <path d="m16 3 4 4-4 4" />
                <path d="M20 7H4" />
                <path d="m8 21-4-4 4-4" />
                <path d="M4 17h16" />
              </svg>
            </span>
          </button>
          <div className={styles.fieldWrap}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="toInput">
                To
              </label>
              <input
                id="toInput"
                className={styles.input}
                placeholder="City or Airport"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={() => setToFocus(true)}
                onBlur={() => setTimeout(() => setToFocus(false), 200)}
                autoComplete="off"
              />
            </div>
            {toFocus && toSuggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {toSuggestions.map((a) => (
                  <li
                    key={a.code}
                    role="option"
                    onMouseDown={() => setTo(a.code)}
                  >
                    {a.code} — {a.city}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="departureDate">
              Departure Date
            </label>
            <input
              id="departureDate"
              type="date"
              className={styles.input}
              min={todayIsoDate()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="passengerCount">
              Passengers
            </label>
            <select
              id="passengerCount"
              className={styles.input}
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={String(n)}>
                  {n} Passenger{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className={styles.submitBtn}>
          Search flights
        </button>
      </form>
    </section>
  );
}
