import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAirports, getFlights, putBookingFlow } from "../api/client.js";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import FlightSearchForm from "../components/home/FlightSearchForm.jsx";
import DealsSection from "../components/home/DealsSection.jsx";
import ResultsSection from "../components/home/ResultsSection.jsx";
import {
  formatDuration,
  formatTime,
} from "../utils/formatters.js";
import styles from "./HomePage.module.css";

function uniqueSorted(nums) {
  return [...new Set(nums)].sort((a, b) => a - b);
}

function applyFilterLogic(flights, { minPrice, maxPrice, stops, airlines }) {
  return flights.filter((f) => {
    const price = f.price.economy;
    const priceMatch = price >= minPrice && price <= maxPrice;
    const stopsMatch = stops.length === 0 || stops.includes(f.stops);
    const airlineMatch =
      airlines.length === 0 || airlines.includes(f.airline);
    return priceMatch && stopsMatch && airlineMatch;
  });
}

function sortFlights(list, sortBy) {
  const copy = [...list];
  if (sortBy === "cheap") {
    copy.sort((a, b) => a.price.economy - b.price.economy);
  } else if (sortBy === "fast") {
    copy.sort((a, b) => a.duration - b.duration);
  } else {
    copy.sort(
      (a, b) =>
        a.price.economy / a.duration - b.price.economy / b.duration
    );
  }
  return copy;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [routeTitle, setRouteTitle] = useState("");
  const [currentFlights, setCurrentFlights] = useState([]);
  const [searchPassengers, setSearchPassengers] = useState(1);
  const [sortBy, setSortBy] = useState("cheap");

  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 2000 });
  const [pendingMaxPrice, setPendingMaxPrice] = useState(2000);
  const [pendingStops, setPendingStops] = useState([]);
  const [pendingAirlines, setPendingAirlines] = useState([]);

  const [appliedMaxPrice, setAppliedMaxPrice] = useState(2000);
  const [appliedStops, setAppliedStops] = useState([]);
  const [appliedAirlines, setAppliedAirlines] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [f, a] = await Promise.all([getFlights(), getAirports()]);
        if (!cancelled) {
          setFlights(f);
          setAirports(a);
        }
      } catch (e) {
        if (!cancelled) setLoadError("Failed to load flights.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const deals = useMemo(() => flights.slice(0, 6), [flights]);

  function openRoute(fromCode, toCode, passengers = searchPassengers) {
    const filtered = flights.filter(
      (f) => f.from.code === fromCode && f.to.code === toCode
    );
    setCurrentFlights(filtered);
    setRouteTitle(`${fromCode} → ${toCode}`);
    setShowResults(true);
    setSearchPassengers(passengers);

    if (filtered.length === 0) {
      setPriceBounds({ min: 0, max: 0 });
      setPendingMaxPrice(0);
      setAppliedMaxPrice(0);
      setPendingStops([]);
      setAppliedStops([]);
      setPendingAirlines([]);
      setAppliedAirlines([]);
      return;
    }

    const prices = filtered.map((f) => f.price.economy);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const stops = uniqueSorted(filtered.map((f) => f.stops));
    const airlines = [...new Set(filtered.map((f) => f.airline))].sort();

    setPriceBounds({ min: minP, max: maxP });
    setPendingMaxPrice(maxP);
    setAppliedMaxPrice(maxP);
    setPendingStops([...stops]);
    setAppliedStops([...stops]);
    setPendingAirlines([...airlines]);
    setAppliedAirlines([...airlines]);
  }

  async function handleSearch(fromCode, toCode, departureDate, passengers) {
    try {
      await putBookingFlow({ selectedDate: departureDate });
    } catch (e) {
      console.error(e);
    }
    openRoute(fromCode, toCode, passengers);
  }

  async function handleDealSelect(fromCode, toCode) {
    const today = new Date().toISOString().slice(0, 10);
    try {
      await putBookingFlow({ selectedDate: today });
    } catch (e) {
      console.error(e);
    }
    openRoute(fromCode, toCode, searchPassengers);
    setTimeout(() => {
      document.getElementById("results-anchor")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  function toggleStop(s) {
    setPendingStops((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function toggleAirline(name) {
    setPendingAirlines((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  function applyFiltersClick() {
    setAppliedMaxPrice(pendingMaxPrice);
    setAppliedStops([...pendingStops]);
    setAppliedAirlines([...pendingAirlines]);
  }

  const filtered = useMemo(
    () =>
      applyFilterLogic(currentFlights, {
        minPrice: priceBounds.min,
        maxPrice: appliedMaxPrice,
        stops: appliedStops,
        airlines: appliedAirlines,
      }),
    [
      currentFlights,
      priceBounds.min,
      appliedMaxPrice,
      appliedStops,
      appliedAirlines,
    ]
  );

  const displayed = useMemo(
    () => sortFlights(filtered, sortBy),
    [filtered, sortBy]
  );

  async function handleSelectFlight(flight, passengerCount) {
    const selectedFlight = {
      flightNumber: flight.flightNumber,
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
    try {
      await putBookingFlow({ selectedFlight });
    } catch (e) {
      alert("Could not save flight selection. Try again.");
      return;
    }
    navigate("/seats");
  }

  const stopOptions = useMemo(() => {
    const s = uniqueSorted(currentFlights.map((f) => f.stops));
    return s.length ? s : [0, 1];
  }, [currentFlights]);

  const airlineOptions = useMemo(() => {
    const a = [...new Set(currentFlights.map((f) => f.airline))].sort();
    return a;
  }, [currentFlights]);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <FlightSearchForm airports={airports} onSearch={handleSearch} />
        {!showResults && (
          <DealsSection
            flights={flights}
            deals={deals}
            onDealSelect={handleDealSelect}
            error={loadError}
          />
        )}
        <div id="results-anchor" />
        <ResultsSection
          visible={showResults}
          routeTitle={routeTitle}
          flightCountText={`${displayed.length} flights found`}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterProps={{
            minPrice: priceBounds.min,
            maxPrice: priceBounds.max,
            priceValue: pendingMaxPrice,
            onPriceInput: setPendingMaxPrice,
            stopOptions,
            selectedStops: pendingStops,
            onStopChange: toggleStop,
            airlines: airlineOptions,
            selectedAirlines: pendingAirlines,
            onAirlineChange: toggleAirline,
            onApply: applyFiltersClick,
          }}
          flights={displayed}
          passengerCount={searchPassengers}
          onSelectFlight={handleSelectFlight}
        />
      </main>
      <Footer />
    </>
  );
}
