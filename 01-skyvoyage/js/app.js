
import { getFlights } from "./api.js";

const dealsContainer = document.getElementById("hotdealsContainer");
const dealsSection = document.getElementById("dealsSection");
const resultsSection = document.getElementById("resultsSection");
const routeTitle = document.getElementById("routeTitle");
const flightCount = document.getElementById("flightCount");
const resultsContainer = document.getElementById("resultsContainer");
let currentFlights = [];

let currentFlights = [];

let activeFilters = {
  minPrice: 0,
  maxPrice: 0,
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

  currentFlights = flights.filter(flight =>
    flight.from.code === fromCode &&
    flight.to.code === toCode
  );

  currentFlights = filteredFlights;

  if (filteredFlights.length === 0) {
  flightCount.textContent = "0 flights found";
  renderResults([]);
  return;
}

  const prices = filteredFlights.map(f => f.price.economy);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  activeFilters = {
    minPrice: minPrice,
    maxPrice: maxPrice,
    stops: [],
    airlines: []
  };

  const priceRange = document.getElementById("priceRange");
  priceRange.min = minPrice;
  priceRange.max = maxPrice;
  priceRange.value = maxPrice;

  document.querySelectorAll(".stopFilter, .airlineFilter")
    .forEach(cb => cb.checked = false);

    document.getElementById("priceValue").textContent = maxPrice;
  

  // flightCount.textContent = `${filteredFlights.length} flights found`;

  // renderResults(filteredFlights);

  selectAllFilters();
  applyFilters();

  flightCount.textContent = `${currentFlights.length} flights found`;

  renderResults(currentFlights);
}


function formatTime(dateString) {
  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hrs}h ${mins}m`;
}
function formatStops(stops) {
  if (stops === 0) return "Direct";
  if (stops === 1) return "1 Stop";
  return `${stops} stops`;
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
          <span> ${formatDuration(flight.duration)}</span>
          <div class="line">
            <span class="dot1"></span>
            ${flight.stops > 0 ? `<span class="dot2"></span>` : ""}
            <span class="dot3"></span>
          </div>
          <span>${formatStops(flight.stops)} </span>
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
document.getElementById("sortSelect")
  .addEventListener("change", handleSort);
  function handleSort(e) {
  const value = e.target.value;

  let sorted = [...currentFlights];

function applyFilters() {
  let filtered = currentFlights.filter(flight => {
    const price = flight.price.economy

    const priceMatch =
      price >= activeFilters.minPrice &&
      price <= activeFilters.maxPrice;

    const stopsMatch =
      activeFilters.stops.length === 0 ||
      activeFilters.stops.includes(flight.stops);

    const airlineMatch =
      activeFilters.airlines.length === 0 ||
      activeFilters.airlines.includes(flight.airline);
    
    return priceMatch && stopsMatch && airlineMatch;
  });
  flightCount.textContent = `${filtered.length} flights found`;
  renderResults(filtered);
}

function selectAllFilters() {

  // Select all stop checkboxes
  document.querySelectorAll(".stopFilter")
    .forEach(cb => cb.checked = true);

  activeFilters.stops =
    [...document.querySelectorAll(".stopFilter")]
      .map(c => Number(c.value));

  // Select all airline checkboxes
  document.querySelectorAll(".airlineFilter")
    .forEach(cb => cb.checked = true);

  activeFilters.airlines =
    [...document.querySelectorAll(".airlineFilter")]
      .map(c => c.value);
}


document.querySelector(".Flight_search_form")
  .addEventListener("submit", (e) => {

    e.preventDefault();

    const fromValue = document.getElementById("fromInput").value.trim().toUpperCase();
    const toValue = document.getElementById("toInput").value.trim().toUpperCase();
  if (value === "cheap") {
    sorted.sort((a, b) => a.price.economy - b.price.economy);
  }

  if (value === "fast") {
    sorted.sort((a, b) => a.duration - b.duration);
  }

  if (value === "best") {
    sorted.sort((a, b) => b.duration - a.duration);
  }

// document.querySelectorAll(".stopFilter")
//   .forEach(cb => {

//     cb.addEventListener("change", () => {

//       activeFilters.stops =
//         [...document.querySelectorAll(".stopFilter:checked")]
//         .map(c => Number(c.value));

//       applyFilters();
//     });

// });

// document.querySelectorAll(".airlineFilter")
//   .forEach(cb => {

//     cb.addEventListener("change", () => {

//       activeFilters.airlines =
//         [...document.querySelectorAll(".airlineFilter:checked")]
//         .map(c => c.value);

//       applyFilters();
//     });

// });

const priceRange = document.getElementById("priceRange");

if (priceRange) {
  priceRange.addEventListener("input", (e) => {
    document.getElementById("priceValue").textContent = e.target.value;
  });
}

const applyBtn = document.getElementById("applyFiltersBtn");

if (applyBtn) {
  applyBtn.addEventListener("click", () => {

    activeFilters.stops =
      [...document.querySelectorAll(".stopFilter:checked")]
        .map(c => Number(c.value));

    activeFilters.airlines =
      [...document.querySelectorAll(".airlineFilter:checked")]
        .map(c => c.value);

    activeFilters.maxPrice =
      Number(document.getElementById("priceRange").value);

    applyFilters();
  });
}
  renderResults(sorted);
}
