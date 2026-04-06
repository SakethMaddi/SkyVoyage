import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingFlow, getSeatMaps, putBookingFlow } from "../api/client.js";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import FlightSummaryBar from "../components/seats/FlightSummaryBar.jsx";
import SeatLegend from "../components/seats/SeatLegend.jsx";
import SeatMap from "../components/seats/SeatMap.jsx";
import SeatPricingSummary from "../components/seats/SeatPricingSummary.jsx";
import PassengerForms from "../components/seats/PassengerForms.jsx";
import styles from "./SeatsPage.module.css";

function upgradeForSeat(seatId, data) {
  const row = parseInt(seatId, 10);
  if (data.businessRows.includes(row)) return 80;
  if (data.exitRows.includes(row)) return 40;
  return 0;
}

export default function SeatsPage() {
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [seatMaps, setSeatMaps] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const flow = await getBookingFlow();
      if (cancelled) return;
      if (!flow?.selectedFlight) {
        navigate("/", { replace: true });
        return;
      }
      setFlight(flow.selectedFlight);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const maps = await getSeatMaps();
        if (!cancelled) setSeatMaps(maps);
      } catch {
        if (!cancelled) setSeatMaps({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const passengerCount = flight?.passengers || 1;

  useEffect(() => {
    setPassengers(
      Array.from({ length: passengerCount }, () => ({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passport: "",
        dob: "",
      }))
    );
  }, [passengerCount]);

  const currentSeatData = flight && seatMaps ? seatMaps[flight.aircraft] : null;

  const seatUpgrade = useMemo(() => {
    if (!currentSeatData) return 0;
    return selectedSeats.reduce(
      (sum, s) => sum + upgradeForSeat(s, currentSeatData),
      0
    );
  }, [selectedSeats, currentSeatData]);

  const baseFare = flight?.price?.economy ?? 0;
  const total = baseFare * selectedSeats.length + seatUpgrade;

  function toggleSeat(seatNumber) {
    if (!currentSeatData || currentSeatData.occupied.includes(seatNumber)) {
      return;
    }
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      }
      if (prev.length >= passengerCount) {
        alert(`You can only select ${passengerCount} seats.`);
        return prev;
      }
      return [...prev, seatNumber];
    });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (selectedSeats.length !== passengerCount) {
      alert(`Please select exactly ${passengerCount} seats.`);
      return;
    }
    const flow = await getBookingFlow();
    const selectedDate = flow?.selectedDate || "";
    const bookingData = {
      flight,
      seats: selectedSeats,
      passengers,
      baseFare,
      seatUpgrade,
      totalPrice: total,
      selectedDate,
    };
    try {
      await putBookingFlow({ bookingData });
    } catch {
      alert("Could not save booking. Try again.");
      return;
    }
    navigate("/booking");
  }

  if (!flight) return null;

  return (
    <>
      <Header />
      <main className={styles.container}>
        <FlightSummaryBar flight={flight} />
        <div className={styles.layout}>
          <div className={styles.section}>
            <h2>Select Your Seats</h2>
            <p>
              Select {passengerCount} seat{passengerCount > 1 ? "s" : ""} for your
              flight
            </p>
            <SeatLegend />
            <SeatMap
              data={currentSeatData}
              selectedSeats={selectedSeats}
              passengerCount={passengerCount}
              onToggle={toggleSeat}
            />
          </div>
          <div className={styles.rightPanel}>
            <SeatPricingSummary
              selectedSeats={selectedSeats}
              baseFare={baseFare}
              seatUpgrade={seatUpgrade}
              total={total}
            />
            <PassengerForms
              count={passengerCount}
              passengers={passengers}
              onChange={setPassengers}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
