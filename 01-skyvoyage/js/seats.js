import { getSeatMaps } from "./api.js";

let selectedSeat = null;
let baseFare = 0;
let seatUpgrade = 0;
let currentSeatData = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const flight =
    JSON.parse(localStorage.getItem("selectedFlight"));
  if (!flight) {
    console.error("No flight found in localStorage");
    return;
  }
  console.log(flight)
  baseFare = flight.price.economy;

  renderFlightSummary(flight);

  const seatMaps = await getSeatMaps();

  currentSeatData =seatMaps[flight.aircraft ];
  if (!currentSeatData) {
    console.error("Seat map not found");
    return;
  }

  generateSeats(currentSeatData);
  generatePassengerForms(flight.passengers || 1);
}

function renderFlightSummary(flight) {
  const summary = document.getElementById("flightSummary");

  if (!summary) return;

  summary.innerHTML = `
    ${flight.from} → ${flight.to}
    • ${flight.airline}
    • ${flight.duration}
    • ${flight.departureTime} - ${flight.arrivalTime}
    • ${flight.stops} Stop
  `;
}

function generateSeats(data) {

  const container =
    document.getElementById("seatContainer");

  container.innerHTML = "";

  for (let row = 1; row <= data.rows; row++) {

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("seat-row");

    const rowNumber = document.createElement("div");
    rowNumber.classList.add("row-number");
    rowNumber.textContent = row;
    rowDiv.appendChild(rowNumber);

    data.columns.forEach(col => {

      const seatNumber = row + col;
      const seat = document.createElement("div");
      seat.classList.add("seat");
      // seat.textContent = col;
      if (data.occupied.includes(seatNumber)) {
        seat.classList.add("occupied");
      } else {
        seat.classList.add("available");
        if (data.businessRows.includes(row))
          seat.classList.add("business");
        if (data.exitRows.includes(row))
          seat.classList.add("exit");
        seat.addEventListener("click", () =>
          selectSeat(seat, seatNumber, row)
        );
      }
      rowDiv.appendChild(seat);
      if (data.aisleAfter.includes(col)) {
        const aisle = document.createElement("div");
        aisle.classList.add("aisle-gap");
        rowDiv.appendChild(aisle);
      }
    });
    container.appendChild(rowDiv);
  }
}

function selectSeat(seatEl, seatNumber, row) {

  document.querySelectorAll(".seat.selected")
    .forEach(s => s.classList.remove("selected"));

  seatEl.classList.add("selected");

  selectedSeat = seatNumber;

  seatUpgrade = 0;

  if (currentSeatData.businessRows.includes(row))
    seatUpgrade = 80;

  if (currentSeatData.exitRows.includes(row))
    seatUpgrade = 40;

  updateSummary();
}

function updateSummary() {

  const seatText =
    document.getElementById("selectedSeatText");

  if (seatText)
    seatText.textContent = `Seat: ${selectedSeat}`;
  document.getElementById("baseFare").textContent = `$${baseFare}`;
  document.getElementById("seatUpgrade")
    .textContent = `$${seatUpgrade}`;

  document.getElementById("totalPrice")
    .textContent =
      `$${baseFare + seatUpgrade}`;
}
function generatePassengerForms(count) {

  const container =
    document.getElementById("passengerFormsContainer");

  container.innerHTML = "";

  for (let i = 1; i <= count; i++) {

    const card = document.createElement("div");
    card.classList.add("passenger-card");

    card.innerHTML = `
      <h3>Passenger ${i}</h3>

      <div class="form-row">
        <div class="firstname">
          <p >First Name</p>
          <input type="text" placeholder="e.g. John" >
        </div>
        <div class="lastname">
        <p>Last Name</p>
        <input type="text" placeholder="e.g. doe">
        </div>
      </div>

      <div class="form-row">
        <div class="email">
          <p>Email</p>
          <input type="email" placeholder="e.g. 8sKdF@example.com">
        </div>
        <div class="phone">
          <p>Phone</p>
          <input type="number" placeholder="e.g. +1234567890">
        </div>
      </div>

      <div class="form-row">
        <div class="passport">
          <p>Passport Number</p>
          <input type="text" placeholder="Passport Number">
        </div>
        <div class="dob">
          <p>Date of Birth</p>
          <input type="date">
        </div>
      </div>
    `;

    container.appendChild(card);
  }
}

document
  .getElementById("bookButton")
  .addEventListener("click", handleContinue);

function handleContinue() {

  const flight =
    JSON.parse(localStorage.getItem("selectedFlight"));

  if (!selectedSeat) {
    alert("Please select a seat.");
    return;
  }

  const passengerCards =
    document.querySelectorAll(".passenger-card");

  const passengers = [];

  passengerCards.forEach(card => {

    const inputs = card.querySelectorAll("input");

    passengers.push({
      firstName: inputs[0].value,
      lastName: inputs[1].value,
      email: inputs[2].value,
      phone: inputs[3].value,
      passport: inputs[4].value,
      dob: inputs[5].value
    });

  });

  const bookingData = {
    flight,
    seat: selectedSeat,
    passengers,
    totalPrice: baseFare + seatUpgrade
  };

  localStorage.setItem(
    "bookingData",
    JSON.stringify(bookingData)
  );
  
  window.location.href = "booking.html";
}