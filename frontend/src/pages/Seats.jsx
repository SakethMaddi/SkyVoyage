import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../context/flightContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSeatMaps } from "../services/api";

export default function Seats() {
  const navigate = useNavigate();
  const { flight, passengers, selectedSeats, setSelectedSeats } =
    useContext(FlightContext);

  const [seatMaps, setSeatMaps] = useState(null);
  const [currentSeatData, setCurrentSeatData] = useState(null);
  const [baseFare, setBaseFare] = useState(0);
  const [seatUpgrade, setSeatUpgrade] = useState(0);
  const [passengerForms, setPassengerForms] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const raw = localStorage.getItem("selectedFlight");
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed && !flight) {
        navigate("/");
        return;
      }
      const f = flight || parsed;
      if (!f?.aircraft) {
        navigate("/");
        return;
      }
      setBaseFare(f.price?.economy || 0);
      try {
        const maps = await getSeatMaps();
        if (cancelled) return;
        setSeatMaps(maps);
        const data = maps[f.aircraft];
        setCurrentSeatData(data || null);
      } catch (e) {
        console.error(e);
        setCurrentSeatData(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [flight, navigate]);

  const pax = flight?.passengers ?? passengers ?? 1;

  useEffect(() => {
    setPassengerForms(
      Array.from({ length: pax }, () => ({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passport: "",
        dob: "",
      }))
    );
  }, [pax]);

  const updatePassenger = (index, field, value) => {
    setPassengerForms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const selectSeat = useCallback(
    (seatNumber) => {
      if (!currentSeatData) return;
      setSelectedSeats((prev) => {
        if (prev.includes(seatNumber)) {
          return prev.filter((s) => s !== seatNumber);
        }
        if (prev.length >= pax) {
          window.alert(`You can only select ${pax} seats.`);
          return prev;
        }
        return [...prev, seatNumber];
      });
    },
    [currentSeatData, pax, setSelectedSeats]
  );

  useEffect(() => {
    if (!currentSeatData) return;
    let totalUpgrade = 0;
    selectedSeats.forEach((seat) => {
      const rowNumber = parseInt(seat, 10);
      if (currentSeatData.businessRows?.includes(rowNumber))
        totalUpgrade += 80;
      else if (currentSeatData.exitRows?.includes(rowNumber))
        totalUpgrade += 40;
    });
    setSeatUpgrade(totalUpgrade);
  }, [selectedSeats, currentSeatData]);

  const totalPerPassengerDisplay =
    selectedSeats.length === 0
      ? 0
      : baseFare * selectedSeats.length + seatUpgrade;

  const handleContinue = (e) => {
    e.preventDefault();
    const f = flight || JSON.parse(localStorage.getItem("selectedFlight") || "{}");
    if (!f?.from) {
      navigate("/");
      return;
    }
    if (selectedSeats.length !== pax) {
      window.alert(`Please select exactly ${pax} seats.`);
      return;
    }
    const passengersPayload = passengerForms.map((p) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      passport: p.passport,
      dob: p.dob,
    }));
    const selectedDate = localStorage.getItem("selectedDate") || "";
    const bookingData = {
      flight: f,
      seats: selectedSeats,
      passengers: passengersPayload,
      baseFare,
      seatUpgrade,
      totalPrice: baseFare * selectedSeats.length + seatUpgrade,
      selectedDate,
    };
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate("/checkout");
  };

  const f = flight || JSON.parse(localStorage.getItem("selectedFlight") || "null");

  return (
    <>
      <Header />
      <main className="container">
        <div className="flight-summary" id="flightSummary">
          {f
            ? `${f.from.code} → ${f.to.code} • ${f.airline} • ${f.duration} • ${f.departureTime} - ${f.arrivalTime} • ${f.stops} Stop`
            : ""}
        </div>
        <div className="seat_selection">
          <div className="seat-layout">
            <div className="seat-section">
              <h2>Select Your Seats</h2>
              <p>Select 1 seat for your flight</p>
              <div className="legend">
                <div>
                  <span className="box_available" /> Available
                </div>
                <div>
                  <span className="box_selected" /> Selected
                </div>
                <div>
                  <span className="box_occupied" /> Occupied
                </div>
                <div>
                  <span className="box_business" /> Business
                </div>
                <div>
                  <span className="box_exit" /> Exit Row
                </div>
              </div>
              <div id="seatContainer" className="seat-container">
                {!currentSeatData && seatMaps && (
                  <p>Seat map not found for this aircraft.</p>
                )}
                {currentSeatData &&
                  Array.from({ length: currentSeatData.rows }, (_, i) => i + 1).map(
                    (row) => (
                      <div key={row} className="seat-row">
                        <div className="row-number">{row}</div>
                        {currentSeatData.columns.flatMap((col) => {
                          const seatNumber = `${row}${col}`;
                          const occupied =
                            currentSeatData.occupied?.includes(seatNumber);
                          const isBusiness =
                            currentSeatData.businessRows?.includes(row);
                          const isExit =
                            currentSeatData.exitRows?.includes(row);
                          const isSelected = selectedSeats.includes(seatNumber);
                          const afterThisCol =
                            currentSeatData.aisleAfter?.includes(col);
                          const seatEl = (
                            <div
                              key={col}
                              className={[
                                "seat",
                                occupied ? "occupied" : "available",
                                !occupied && isBusiness ? "business" : "",
                                !occupied && isExit ? "exit" : "",
                                isSelected ? "selected" : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              role={occupied ? undefined : "button"}
                              tabIndex={occupied ? undefined : 0}
                              onClick={() =>
                                !occupied && selectSeat(seatNumber)
                              }
                              onKeyDown={(e) => {
                                if (
                                  !occupied &&
                                  (e.key === "Enter" || e.key === " ")
                                ) {
                                  e.preventDefault();
                                  selectSeat(seatNumber);
                                }
                              }}
                            />
                          );
                          if (afterThisCol) {
                            return [
                              seatEl,
                              <div
                                key={`${col}-aisle`}
                                className="aisle-gap"
                              />,
                            ];
                          }
                          return [seatEl];
                        })}
                      </div>
                    )
                  )}
              </div>
            </div>
            <div className="right-panel">
              <div className="summary-card">
                <h3>Your Selection</h3>
                <p id="selectedSeatText">
                  {selectedSeats.length === 0
                    ? "No seats selected"
                    : `Seats: ${selectedSeats.join(", ")}`}
                </p>
                <hr />
                <div className="price-row">
                  <span>Base fare</span>
                  <span id="baseFare">${baseFare}</span>
                </div>
                <div className="price-row">
                  <span>Seat upgrades</span>
                  <span id="seatUpgrade">${seatUpgrade}</span>
                </div>
                <hr />
                <div className="price-row total">
                  <span>Total per passenger</span>
                  <span id="totalPrice">${totalPerPassengerDisplay}</span>
                </div>
              </div>
              <form id="bookingForm" onSubmit={handleContinue}>
                <div id="passengerFormsContainer">
                  {passengerForms.map((p, i) => (
                    <div key={i} className="passenger-card">
                      <h3>Passenger {i + 1}</h3>
                      <div className="form-row">
                        <div className="firstname">
                          <p>First Name</p>
                          <input
                            type="text"
                            placeholder="e.g. John"
                            required
                            value={p.firstName}
                            onChange={(e) =>
                              updatePassenger(i, "firstName", e.target.value)
                            }
                          />
                        </div>
                        <div className="lastname">
                          <p>Last Name</p>
                          <input
                            type="text"
                            placeholder="e.g. doe"
                            required
                            value={p.lastName}
                            onChange={(e) =>
                              updatePassenger(i, "lastName", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="email">
                          <p>Email</p>
                          <input
                            type="email"
                            placeholder="e.g. 8sKdF@example.com"
                            required
                            value={p.email}
                            onChange={(e) =>
                              updatePassenger(i, "email", e.target.value)
                            }
                          />
                        </div>
                        <div className="phone">
                          <p>Phone</p>
                          <input
                            type="tel"
                            placeholder="e.g. +1234567890"
                            required
                            value={p.phone}
                            onChange={(e) =>
                              updatePassenger(i, "phone", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="passport">
                          <p>Passport Number</p>
                          <input
                            type="text"
                            placeholder="Passport Number"
                            required
                            value={p.passport}
                            onChange={(e) =>
                              updatePassenger(i, "passport", e.target.value)
                            }
                          />
                        </div>
                        <div className="dob">
                          <p>Date of Birth</p>
                          <input
                            type="date"
                            required
                            value={p.dob}
                            onChange={(e) =>
                              updatePassenger(i, "dob", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  id="bookButton"
                  type="submit"
                  className="continue-btn"
                >
                  Continue to Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
