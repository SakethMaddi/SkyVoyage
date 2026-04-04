import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FlightContext } from "../context/flightContext";
import {
  formatTime,
  formatDuration,
  formatStops,
} from "../utils/flightFormat";

const AIRLINES = [
  "Atlas Airways",
  "Polar Jet",
  "Sunrise Airlines",
  "NorthStar Flights",
  "Oceanic Wings",
  "Skyline Air",
];

function sortFlights(list, mode) {
  const copy = [...list];
  if (mode === "cheap")
    copy.sort((a, b) => a.price.economy - b.price.economy);
  else if (mode === "fast")
    copy.sort((a, b) => a.duration - b.duration);
  else
    copy.sort(
      (a, b) =>
        a.price.economy / Math.max(a.duration, 1) -
        b.price.economy / Math.max(b.duration, 1)
    );
  return copy;
}

export default function Results({
  routeTitle,
  flights: initialFlights,
  passengerCount,
}) {
  const navigate = useNavigate();
  const { setFlight } = useContext(FlightContext);

  const [sortMode, setSortMode] = useState("cheap");
  const [priceMax, setPriceMax] = useState(2000);
  const [priceSliderMax, setPriceSliderMax] = useState(2000);
  const [priceSliderMin, setPriceSliderMin] = useState(0);
  const [stopFilters, setStopFilters] = useState([]);
  const [airlineFilters, setAirlineFilters] = useState([]);

  const baseList = useMemo(
    () => sortFlights(initialFlights, sortMode),
    [initialFlights, sortMode]
  );

  useEffect(() => {
    if (initialFlights.length === 0) {
      setPriceSliderMin(0);
      setPriceSliderMax(2000);
      setPriceMax(2000);
      setStopFilters([]);
      setAirlineFilters([]);
      return;
    }
    const prices = initialFlights.map((f) => f.price.economy);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    setPriceSliderMin(minP);
    setPriceSliderMax(maxP);
    setPriceMax(maxP);
    setStopFilters([0, 1]);
    setAirlineFilters(AIRLINES.filter((a) =>
      initialFlights.some((f) => f.airline === a)
    ));
  }, [initialFlights]);

  const filtered = useMemo(() => {
    return baseList.filter((flight) => {
      const price = flight.price.economy;
      const priceMatch = price >= priceSliderMin && price <= priceMax;
      const stopsMatch =
        stopFilters.length === 0 || stopFilters.includes(flight.stops);
      const airlineMatch =
        airlineFilters.length === 0 ||
        airlineFilters.includes(flight.airline);
      return priceMatch && stopsMatch && airlineMatch;
    });
  }, [baseList, priceSliderMin, priceMax, stopFilters, airlineFilters]);

  const toggleStop = (value, checked) => {
    const n = Number(value);
    setStopFilters((prev) =>
      checked ? [...prev, n] : prev.filter((x) => x !== n)
    );
  };

  const toggleAirline = (name, checked) => {
    setAirlineFilters((prev) =>
      checked ? [...prev, name] : prev.filter((x) => x !== name)
    );
  };

  const selectFlight = (flight) => {
    const selectedFlight = {
      flightNumber: flight.flightNumber || flight.id,
      from: { code: flight.from.code, city: flight.from.city },
      to: { code: flight.to.code, city: flight.to.city },
      aircraft: flight.aircraft,
      airline: flight.airline,
      price: flight.price,
      stops: flight.stops,
      arrivalTime: formatTime(flight.arrivalTime),
      departureTime: formatTime(flight.departureTime),
      duration: formatDuration(flight.duration),
      passengers: passengerCount,
    };
    setFlight(selectedFlight);
    localStorage.setItem("selectedFlight", JSON.stringify(selectedFlight));
    navigate("/seats");
  };

  return (
    <section id="resultsSection">
      <div className="results-header">
        <h2 id="routeTitle">{routeTitle}</h2>
        <p id="flightCount">{filtered.length} flights found</p>
        <div className="sort">
          <p>Sort by:</p>
          <select
            name="sort"
            id="sortSelect"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="cheap">Cheaper First</option>
            <option value="best">Best Value</option>
            <option value="fast">Fastest First</option>
          </select>
        </div>
      </div>

      <div className="results-layout">
        <aside className="filters">
          <div className="filter-group">
            <h4>Max Price</h4>
            <input
              type="range"
              id="priceRange"
              min={priceSliderMin}
              max={priceSliderMax}
              value={priceMax}
              onInput={(e) => setPriceMax(Number(e.target.value))}
              onChange={(e) => setPriceMax(Number(e.target.value))}
            />
            <p>
              Up to $<span id="priceValue">{priceMax}</span>
            </p>
          </div>

          <div className="filter-group">
            <h4>Stops</h4>
            <label>
              <input
                type="checkbox"
                className="stopFilter"
                value="0"
                checked={stopFilters.includes(0)}
                onChange={(e) => toggleStop(0, e.target.checked)}
              />
              Direct
            </label>
            <label>
              <input
                type="checkbox"
                className="stopFilter"
                value="1"
                checked={stopFilters.includes(1)}
                onChange={(e) => toggleStop(1, e.target.checked)}
              />
              1 Stop
            </label>
          </div>

          <div className="filter-group">
            <h4>Airlines</h4>
            {AIRLINES.map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  className="airlineFilter"
                  value={name}
                  checked={airlineFilters.includes(name)}
                  onChange={(e) => toggleAirline(name, e.target.checked)}
                />
                {name}
              </label>
            ))}
            <button
              type="button"
              id="applyFiltersBtn"
              className="apply-btn"
              onClick={() => {
                /* Filters apply live; button kept for original layout parity */
              }}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        <div id="resultsContainer">
          {filtered.map((flight) => (
            <div key={flight.id} className="result-card">
              <div className="airline">{flight.airline}</div>
              <div className="time-block">
                <h3>{formatTime(flight.departureTime)}</h3>
                <span>{flight.from.code}</span>
              </div>
              <div className="duration">
                <span>{formatDuration(flight.duration)}</span>
                <div className="line">
                  <span className="dot1" />
                  {flight.stops > 0 ? <span className="dot2" /> : null}
                  <span className="dot3" />
                </div>
                <span>{formatStops(flight.stops)}</span>
              </div>
              <div className="time-block">
                <h3>{formatTime(flight.arrivalTime)}</h3>
                <span>{flight.to.code}</span>
              </div>
              <div className="price">
                ${flight.price.economy}
                <p>Economy</p>
                ${flight.price.business}
                <p>Business</p>
                <button
                  type="button"
                  className="select-btn"
                  onClick={() => selectFlight(flight)}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
