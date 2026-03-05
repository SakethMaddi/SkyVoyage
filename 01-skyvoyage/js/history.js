if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", loadBookingHistory);

function loadBookingHistory() {

  const bookingHistory =
    JSON.parse(localStorage.getItem("allBookings")) || [];

  console.log("Loaded booking history:", bookingHistory);

  const bookingHistoryContainer =
    document.getElementById("bookingHistoryContainer");
  if (bookingHistory.length === 0) {
    bookingHistoryContainer.innerHTML =
      "<p>You have no past bookings.</p>";
    return;
  }

  bookingHistory.forEach(booking => {

    const bookingItem = document.createElement("div");
    bookingItem.classList.add("booking-item");

    const bookingDetails = document.createElement("div");
    bookingDetails.classList.add("booking-details");
    const formattedDate =
      new Date(booking.selectedDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    const passengerRows = booking.passengers.map((p, index) => `
      <tr>
        <td>${p.firstName} ${p.lastName}</td>
        <td>${p.email}</td>
        <td>${booking.seats[index]}</td>
      </tr>
    `).join("");
    bookingItem.innerHTML = `
            <h3>${booking.flight.from.code} → ${booking.flight.to.code}</h3>
            <p><span>${booking.reference}</span></p>
            <p>${formattedDate}</p>
            <p>$${Number(booking.totalPrice).toFixed(2)}</p>`;
    bookingDetails.innerHTML = `
      <div class="flight-details">
        <h4>Flight Details</h4>
        <p><strong>Airline:</strong> ${booking.flight.airline}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${booking.flight.departureTime} - ${booking.flight.arrivalTime}</p>
        <p><strong>Duration:</strong> ${booking.flight.duration}</p>
        <p><strong>Stops:</strong> ${booking.flight.stops}</p>
      </div>
      <div class="passenger-details">
        <h4>Passengers</h4>
        <table class="passenger-table" border="1" cellspacing="0">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Seat</th>
            </tr>
          <tr>
            ${passengerRows}
          </tr>
        </table>
      </div>
    `;
    bookingItem.appendChild(bookingDetails);
    bookingHistoryContainer.appendChild(bookingItem);
    bookingItem.addEventListener("click", () => {
      bookingDetails.classList.toggle("active");
    });

  });

}