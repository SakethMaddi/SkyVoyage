import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import Seats from "./pages/Seats";
import Bookings from "./pages/Bookings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/seats" element={<Seats />} />
        <Route path="/bookings" element={<Bookings />}  />
      </Routes>
    </BrowserRouter>
  );
}