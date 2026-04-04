import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getFlights } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/search.css";

export default function Search() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();
  
  const [flights, setFlights] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // form state (IMPORTANT - no querySelector)
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      const data = await getFlights();
      setDeals(data.slice(0, 6)); // first 6 cards
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await getFlights();

      // filter based on input
      const filtered = data.filter((f) =>
        f.from.city.toLowerCase().includes(from.toLowerCase()) &&
        f.to.city.toLowerCase().includes(to.toLowerCase())
      );

      setFlights(filtered);
      setShowResults(true);

      // scroll down
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDealClick = async (deal) => {
    try {
      const data = await getFlights();

      const filtered = data.filter(
        (f) =>
          f.from.code === deal.from.code &&
          f.to.code === deal.to.code
      );

      setFlights(filtered);
      setShowResults(true);

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (flight) => {
    navigate("/seats", {
      state: { flight, passengers },
    });
  };

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="hero">
        <h1>Where will you fly next?</h1>
        <p>Search thousands of flights and find the best deals</p>

        <div className="search-box">
          <input placeholder="From" 
          value={from}
          onChange={(e) => setFrom(e.target.value)}/>
          <input placeholder="To" 
          value={to}
          onChange={(e) => setTo(e.target.value)} />
          <input type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)} />
          <select 
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
          >
            <option value={1}>1 Passenger</option>
            <option value={2}>2 Passengers</option>
            <option value={3}>3 Passengers</option>
            <option value={4}>4 Passengers</option>
            <option value={5}>5 Passengers</option>
            <option value={6}>6 Passengers</option>
          </select>

          <button onClick={handleSearch}>Search Flights</button>
        </div>
      </section>

      {/* DEALS SECTION */}
      {!showResults && (
        <section className="deals">
          <h2>Popular Destinations</h2>

          <div className="deals-container">
            {deals.map((deal, index) => (
              <div
                key={index}
                className="deal-card"
                onClick={() => handleDealClick(deal)}
              >
                <h3>
                  {deal.from.city} → {deal.to.city}
                </h3>
                <p>
                  {deal.from.code} — {deal.to.code}
                </p>
                <h4>From ${deal.price.economy}</h4>
              </div>
            ))}
          </div>
        </section>
      )}
      {showResults && (
      <section className="results">
        <h2>
          {flights[0]?.from?.code} → {flights[0]?.to?.code}
        </h2>

        <p>{flights.length} flights found</p>

        <div className="results-container">
          {flights.map((flight, index) => (
            <div key={index} className="flight-card">
              
              <div className="flight-left">
                <h3>{flight.airline}</h3>

                <p>
                  {flight.departureTime} → {flight.arrivalTime}
                </p>

                <p>
                  {flight.from.code} → {flight.to.code}
                </p>
              </div>

              <div className="flight-right">
                <h3>${flight.price.economy}</h3>
                <button onClick={() =>  handleSelect(flight)}>Select</button>
              </div>

            </div>
          ))}
        </div>
      </section>
    )}
    </>
  );
}