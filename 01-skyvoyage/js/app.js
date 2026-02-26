
import { getFlights } from "./api.js";

const dealsContainer = document.getElementById("hotdealsContainer");
const dealsSection = document.getElementById("dealsSection");
const resultsSection = document.getElementById("resultsSection");
const routeTitle = document.getElementById("routeTitle");
const flightCount = document.getElementById("flightCount");
const resultsContainer = document.getElementById("resultsContainer");

let currentFlights = [];

let activeFilters = {
  minPrice: 0,
  maxPrice: 5000,
  stops: [],
  airlines: []
};  


init();



async function init() {
  try {
    const flights = await getFlights();
    const firstSixDeals = flights.slice(0, 6);
    renderDeals(firstSixDeals, flights);
  } catch (error) {
    console.error("Error loading flights:", error);
    dealsContainer.innerHTML = "<p>Failed to load deals.</p>";
  }
}
function countFlights(from, to, flights) {
  return flights.filter(flight =>
    flight.from.city === from &&
    flight.to.city === to
  ).length;
}

function renderDeals(deals, allFlights) {
  dealsContainer.innerHTML = "";
  const colors = ["#3b82f6", "#8b5cf6", "#f97316", "#22c55e", "#ef4444", "#eab308", "#ec4899"];
  deals.forEach((deal, index) => {
    const flightTotal = countFlights(deal.from.city, deal.to.city, allFlights);
    const card = document.createElement("div");
    card.classList.add("deal-card");
    card.style.backgroundColor = colors[index % colors.length];
    card.innerHTML = `
      <div class="card-top">
        <span class="tag">${deal.tag}</span>
        <h2>${deal.from.city} → ${deal.to.city}</h2>
        <p>${deal.from.code} — ${deal.to.code}</p>
      </div>
      <div class="card-bottom">
        <h3>From $${deal.price.economy}</h3>
        <p>${flightTotal} flights daily</p>
      </div>
    `;
    card.addEventListener("click", () => {
      showResults(deal.from.code, deal.to.code);
    });
    dealsContainer.appendChild(card);
  });
}
function showResults(fromCode, toCode) {
  routeTitle.textContent = `${fromCode} → ${toCode}`;

  dealsSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  loadFilteredFlights(fromCode, toCode);

  resultsSection.scrollIntoView({ behavior: "smooth" });
}

async function loadFilteredFlights(fromCode, toCode) {
  const flights = await getFlights();

  const filteredFlights = flights.filter(flight =>
    flight.from.code === fromCode &&
    flight.to.code === toCode
  );

  flightCount.textContent = `${filteredFlights.length} flights found`;

  renderResults(filteredFlights);

  // currentFlights = filteredFlights;
  // applyFilters();


}
function formatTime(dateString) {
  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function renderResults(flights) {
  resultsContainer.innerHTML = "";

  flights.forEach(flight => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    card.innerHTML = `
      <div class="airline">${flight.airline}</div>

      <div class="time-block">
        <h3>${formatTime(flight.departureTime)}</h3>
        <span>${flight.from.code}</span>
      </div>

      <div class="duration">
        ${flight.duration}
        <div>${flight.stops} Stop</div>
      </div>

      <div class="time-block">
        <h3>${formatTime(flight.arrivalTime)}</h3>
        <span>${flight.to.code}</span>
      </div>

      <div class="price">
        $${flight.price.economy}
        <p>Economy</p>
        $${flight.price.business}
        <p>Business</p>
        <button class="select-btn">Select</button>
      </div>
    `;

    resultsContainer.appendChild(card);
  });
}


// function applyFilters() {
//   let filtered =
// }



document.querySelector(".Flight_search_form")
  .addEventListener("submit", (e) => {

    e.preventDefault();

    const fromValue = document.getElementById("fromInput").value.trim().toUpperCase();
    const toValue = document.getElementById("toInput").value.trim().toUpperCase();

    if (!fromValue || !toValue) {
      alert("Please enter both From and To airports");
      return;
    }

    showResults(fromValue, toValue);
});

