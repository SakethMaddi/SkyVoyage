import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FlightProvider } from "./context/flightContext";
import Search from "./pages/Search";
import Seats from "./pages/Seats";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import MyBookings from "./pages/MyBookings";

export default function App() {
  return (
    <FlightProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/seats" element={<Seats />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </BrowserRouter>
    </FlightProvider>
  );
}
