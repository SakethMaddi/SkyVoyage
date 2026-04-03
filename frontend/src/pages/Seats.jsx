import { useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/seats.css";
import { useNavigate } from "react-router-dom";

export default function Seats() {
  const location = useLocation();
  const flight = location.state?.flight;
  const passengers = location.state?.passengers;
  const navigate = useNavigate();


  const [selectedSeats, setSelectedSeats] = useState([]);

  const rows = 26;
  const cols = ["A", "B", "C", "D", "E", "F"];

  const [passengerDetails, setPassengerDetails] = useState(
    Array.from({ length: passengers }, () => ({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      passport: "",
      dob: "",
    }))
  );

  const handleContinue = () => {
    navigate("/bookings", {
      state: {
        flight,
        passengers,
        selectedSeats,
        passengerDetails,
      },
    });
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...passengerDetails];
    updated[index][field] = value;
    setPassengerDetails(updated);
  };

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      if (selectedSeats.length < passengers) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  return (
    <div className="seat-page">

      {/* TOP BAR */}
      <div className="flight-header">
        <h2>{flight?.from?.code} → {flight?.to?.code}</h2>
        <p>{flight?.airline} • {flight?.departureTime} - {flight?.arrivalTime}</p>
      </div>

      <div className="seat-layout">

        {/* LEFT SIDE */}
        <div className="seat-section">

          <h3>Select Your Seats</h3>

          {/* LEGEND */}
          <div className="legend">
            <span className="box available"></span> Available
            <span className="box selected"></span> Selected
            <span className="box occupied"></span> Occupied
            <span className="box exit"></span> Exit Row
          </div>

          {/* GRID */}
          <div className="seat-grid">

            {/* COLUMN LABELS */}
            <div className="seat-row labels">
              {cols.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>

            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="seat-row">

                <span className="row-number">{rowIndex + 1}</span>

                {cols.map((col, i) => {
                  const seat = `${rowIndex + 1}${col}`;
                  const isSelected = selectedSeats.includes(seat);

                  const isExit = rowIndex === 9 || rowIndex === 10;

                  return (
                    <div
                      key={seat}
                      className={`seat 
                        ${isSelected ? "selected" : ""}
                        ${isExit ? "exit" : ""}
                      `}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="summary">

          <h3>Your Selection</h3>

          <p>{selectedSeats.length ? selectedSeats.join(", ") : "No seats selected"}</p>

          <div className="price-box">
            <p>Base fare: ${flight?.price?.economy || 0}</p>
            <p>Total: ${selectedSeats.length * (flight?.price?.economy || 0)}</p>
          </div>

          <button 
          disabled={selectedSeats.length !== passengers} 
          onClick={handleContinue}
          >
            Continue to Booking
          </button>

          {/* PASSENGER FORM */}
          <div className="passenger-form">
          {passengerDetails.map((p, index) => (
            <div key={index} className="passenger-card">

              <h4>Passenger {index + 1}</h4>

              <input
                placeholder="First Name"
                value={p.firstName}
                onChange={(e) =>
                  handleInputChange(index, "firstName", e.target.value)
                }
              />

              <input
                placeholder="Last Name"
                value={p.lastName}
                onChange={(e) =>
                  handleInputChange(index, "lastName", e.target.value)
                }
              />

              <input
                placeholder="Email"
                value={p.email}
                onChange={(e) =>
                  handleInputChange(index, "email", e.target.value)
                }
              />

              <input
                placeholder="Phone"
                value={p.phone}
                onChange={(e) =>
                  handleInputChange(index, "phone", e.target.value)
                }
              />

              <input
                placeholder="Passport Number"
                value={p.passport}
                onChange={(e) =>
                  handleInputChange(index, "passport", e.target.value)
                }
              />

              <input
                type="date"
                value={p.dob}
                onChange={(e) =>
                  handleInputChange(index, "dob", e.target.value)
                }
              />

            </div>
          ))}
        </div>

        </div>

      </div>
    </div>
  );
}