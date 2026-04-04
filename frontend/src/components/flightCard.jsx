// src/components/FlightCard.jsx

import { useContext } from "react";
import { FlightContext } from "../context/flightContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Results.module.css";
import common from "../styles/Common.module.css";

export default function FlightCard({ flight }) {
  const { setFlight } = useContext(FlightContext);
  const navigate = useNavigate();

  const handleSelect = () => {
    setFlight(flight);
    navigate("/seats");
  };

  return (
    <div className={`${styles.card} ${common.card}`}>
      <div>
        <h3>{flight.airline}</h3>
        {/* <p>{flight.departureTime} → {flight.arrivalTime}</p> */}
        <p>{flight.from.code} → {flight.to.code}</p>
      </div>

      <div>
        <h3>${flight.price.economy}</h3>
        <button className={common.buttonPrimary} onClick={handleSelect}>
          Select
        </button>
      </div>
    </div>
  );
}