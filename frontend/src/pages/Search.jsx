import { useState, useEffect, useContext } from "react";
import { getFlights } from "../services/api";
import { FlightContext } from "../context/flightContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchForm from "../components/searchForm";
import Deals from "../components/deals";
import Results from "../components/results";

export default function Search() {
  const { setPassengers } = useContext(FlightContext);
  const [passengerCount, setPassengerCount] = useState(1);
  const [allFlights, setAllFlights] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [routeTitle, setRouteTitle] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getFlights();
        if (!cancelled) setAllFlights(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setAllFlights([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const deals = allFlights.slice(0, 6);

  const openResults = (fromCode, toCode, pax = passengerCount) => {
    setPassengers(pax);
    const dateInput = localStorage.getItem("selectedDate");
    if (!dateInput) {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const d = String(today.getDate()).padStart(2, "0");
      localStorage.setItem("selectedDate", `${y}-${m}-${d}`);
    }

    setRouteTitle(`${fromCode} → ${toCode}`);
    const list = allFlights.filter(
      (f) => f.from.code === fromCode && f.to.code === toCode
    );
    setFilteredFlights(list);
    setShowResults(true);
    requestAnimationFrame(() => {
      document.getElementById("resultsSection")?.scrollIntoView({
        behavior: "smooth",
      });
    });
  };

  const handleSearch = ({ fromCode, toCode, passengerCount: pax }) => {
    if (pax != null) setPassengerCount(pax);
    openResults(fromCode, toCode, pax ?? passengerCount);
  };

  const handleDealClick = (fromCode, toCode) => {
    openResults(fromCode, toCode, passengerCount);
  };

  return (
    <>
      <Header />
      <main>
        <SearchForm
          onSearch={handleSearch}
          passengerCount={passengerCount}
          setPassengerCount={setPassengerCount}
        />
        {!showResults && (
          <Deals
            deals={deals}
            allFlights={allFlights}
            onDealClick={handleDealClick}
          />
        )}
        {showResults && (
          <Results
            routeTitle={routeTitle}
            flights={filteredFlights}
            passengerCount={passengerCount}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
