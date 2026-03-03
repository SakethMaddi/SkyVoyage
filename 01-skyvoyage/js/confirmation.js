document.addEventListener("DOMContentLoaded", loadConfirmation);

function loadConfirmation() {
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));

  if (!bookingData) {
    console.error("No booking data found");
    return;
  }
const {
    flight,
    passengers,
    seats,
    totalPrice,
    selectedDate
  } = bookingData;
 // 🔹 Generate Unique Booking Reference
  const reference = generateBookingReference();

  // 🔹 Format Date
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const passengerNames = passengers
    .map(p => `${p.firstName} ${p.lastName}`)
    .join(", ");
    // 🔹 Display Data
  document.querySelector(".cnfm-booking-reference").innerHTML = `
    <p>BOOKING REFERENCE</p>
    <h2>${reference}</h2>
  `;

  document.querySelector(".cnfm-location-details").textContent =
    `${flight.from.code} (${flight.from.city}) → ${flight.to.code} (${flight.to.city})`;

  document.querySelector(".cnfm-flight-details").textContent =
    `${flight.airline} | ${formattedDate} | ${flight.departureTime} - ${flight.arrivalTime}`;

  document.querySelector(".cnfm-passenger-details").innerHTML = `
    <h3>Passengers</h3>
    <div class="passenger-row">
      <span>${passengerNames}</span>
      <span>Seat ${seats}</span>
    </div>
  `;
document.querySelector(".cnfm-payment-details").innerHTML = `
    <h3>Total Paid</h3>
    <h2>$${Number(totalPrice).toFixed(2)}</h2>
  `;

  // 🔹 Save Final Booking (with reference) for history page
  const finalBooking = {
    reference,
    flight,
    passengers,
    seats,
    totalPrice,
    selectedDate
  };

  let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
  allBookings.push(finalBooking);
  localStorage.setItem("allBookings", JSON.stringify(allBookings));

  // Clear temporary bookingData
  localStorage.removeItem("bookingData");
}


// 🔥 Unique Booking Reference Generator
function generateBookingReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const random = (len) =>
    Array.from({ length: len }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

  return `SKV-${random(6)}-${random(4)}`;
}