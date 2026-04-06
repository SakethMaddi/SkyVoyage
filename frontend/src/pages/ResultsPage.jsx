import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getFlights } from "../api/client.js";
import ResultsSection from "../components/home/ResultsSection.jsx";

export default function ResultsPage() {
  const { state } = useLocation();

  const [allFlights, setAllFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);

  const [filters, setFilters] = useState({
    maxPrice: 20000,
    maxDuration: 20,
  });

  const [sortBy, setSortBy] = useState("cheap");

  useEffect(() => {
    getFlights().then((data) => {
      setAllFlights(data);

      const maxPrice = Math.max(...data.map((f) => f.price));
      setFilters((prev) => ({ ...prev, maxPrice }));
    });
  }, []);

  useEffect(() => {
    let result = [...allFlights];

    if (state?.from && state?.to) {
      result = result.filter(
        (f) =>
          f.from?.toLowerCase() === state.from.toLowerCase() &&
          f.to?.toLowerCase() === state.to.toLowerCase()
      );
    }

    result = result.filter(
      (f) =>
        f.price <= filters.maxPrice &&
        f.duration <= filters.maxDuration
    );

    if (sortBy === "cheap") result.sort((a, b) => a.price - b.price);
    if (sortBy === "fast") result.sort((a, b) => a.duration - b.duration);

    setFilteredFlights(result);
  }, [allFlights, filters, sortBy, state]);

  return (
    <ResultsSection
      visible={true}
      routeTitle={`${state?.from || ""} → ${state?.to || ""}`}
      flightCountText={`${filteredFlights.length} flights found`}
      sortBy={sortBy}
      onSortChange={setSortBy}
      filterProps={{ filters, setFilters }}
      flights={filteredFlights}
      passengerCount={1}
      onSelectFlight={(f) => console.log(f)}
    />
  );
}