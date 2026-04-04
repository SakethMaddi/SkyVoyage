import { createContext, useState } from "react";

export const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);

  return (
    <FlightContext.Provider
      value={{
        flight,
        setFlight,
        passengers,
        setPassengers,
        selectedSeats,
        setSelectedSeats,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};
