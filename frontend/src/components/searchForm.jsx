import { useEffect, useState } from "react";

export default function SearchForm({ onSearch, passengerCount, setPassengerCount }) {
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [dateMin, setDateMin] = useState("");
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    setDateMin(formatted);
    setDepartureDate(formatted);
  }, []);

  const switchAirports = (e) => {
    e.preventDefault();
    const t = fromInput;
    setFromInput(toInput);
    setToInput(t);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fromValue = fromInput.trim().toUpperCase();
    const toValue = toInput.trim().toUpperCase();

    if (!fromValue || !toValue) {
      window.alert("Please enter both From and To airports");
      return;
    }

    let date = departureDate;
    if (!date) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      date = `${year}-${month}-${day}`;
    }

    localStorage.setItem("selectedDate", date);
    onSearch({ fromCode: fromValue, toCode: toValue, date, passengerCount });
  };

  return (
    <section className="hero">
      <div className="hero_section">
        <h1>Where will you fly next?</h1>
        <p className="hero_section_p">
          Search thousands of flights and find the best deals
        </p>
        <form className="Flight_search_form" onSubmit={handleSubmit}>
          <div className="search_form">
            <div className="serach_form_field">
              <label htmlFor="fromInput" className="serach_form_label">
                From
              </label>
              <input
                type="text"
                id="fromInput"
                className="serach_form_input"
                placeholder="City or Airpot"
                value={fromInput}
                onChange={(e) => setFromInput(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="search_form_switch_btn"
              id="switchbutton"
              onClick={switchAirports}
              aria-label="Swap from and to"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide_arrow"
              >
                <path d="m16 3 4 4-4 4" />
                <path d="M20 7H4" />
                <path d="m8 21-4-4 4-4" />
                <path d="M4 17h16" />
              </svg>
            </button>
            <div className="serach_form_field">
              <label htmlFor="toInput" className="serach_form_label">
                TO
              </label>
              <input
                type="text"
                id="toInput"
                className="serach_form_input"
                placeholder="City or Airpot"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
              />
            </div>
            <div className="serach_form_field">
              <label htmlFor="departureDate" className="serach_form_label">
                Departure Date
              </label>
              <input
                type="date"
                id="departureDate"
                className="serach_form_input"
                min={dateMin}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
            <div className="serach_form_field">
              <label htmlFor="passengerCount" className="serach_form_label">
                Passengers
              </label>
              <select
                className="serach_form_input"
                id="passengerCount"
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Passenger{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="flight_form_sub_btn" id="searchBtn">
            search flights
          </button>
        </form>
      </div>
    </section>
  );
}
