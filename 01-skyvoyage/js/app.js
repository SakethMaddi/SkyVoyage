const container = document.getElementById("hotdealsContainer");

fetch("data/flights.json")
    .then(response => response.json())
    .then(data => {
        const firstSixDeals = data.slice(0, 6); 
        renderDeals(firstSixDeals,data);
    })
    .catch(error => {
        console.error("Error loading flights:", error);
        container.innerHTML = "<p>Failed to load deals.</p>";
    });

function countFlights(from, to, flights) {
  return flights.filter(flight =>
    flight.from.city === from && flight.to.city === to
  ).length;
}
function renderDeals(deals,allFlights) {
  container.innerHTML = "";
  deals.forEach((deal,i )=> {
    const colors = ["blue", "purple", "orange", "green","red","yellow","pink"];
    const flightCount = countFlights(deal.from.city, deal.to.city, allFlights);
    const card = document.createElement("div");
    card.classList.add("deal-card", deal.gradient);
    card.innerHTML = `
      <div class="card-top">
        <span class="tag">${deal.tag}</span>
        <h2>${deal.from.city} → ${deal.to.city}</h2>
        <p>${deal.from.code} — ${deal.to.code}</p>
      </div>

      <div class="card-bottom">
        <h3>From $${deal.price.economy}</h3>
        <p>${flightCount} flights daily</p>
      </div>
    `;
    
    container.appendChild(card);
    card.style.backgroundColor= colors[i];
    
  });
}


//search

import { getFlights } from "./api.js";
let allFlights = [];

(async function () {
  allFlights = await getFlights();  
})();

function filterFlights(fromCode, toCode) {
  return allFlights.filter(flight =>
    flight.from.code === fromCode &&
    flight.to.code === toCode
  );
}


function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

function renderFlights(flights) {

  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";

  if (flights.length === 0) {
    container.innerHTML = "<p>No flights found.</p>";
    return;
  }

  flights.forEach(flight => {

    const stopsText =
      flight.stops === 0 ? "Direct" :
      flight.stops === 1 ? "1 Stop" :
      `${flight.stops} Stops`;

    const card = document.createElement("div");
    card.classList.add("flight-card");

    card.innerHTML = `
      <div class="flight-card-left">
        <h3>${flight.airline}</h3>
      </div>

      <div class="flight-card-middle">
        <div class="time-block">
          <h2>${formatTime(flight.departureTime)}</h2>
          <p>${flight.from.code}</p>
        </div>

        <div class="duration-block">
          <p>${formatDuration(flight.duration)}</p>
          <p>${stopsText}</p>
        </div>

        <div class="time-block">
          <h2>${formatTime(flight.arrivalTime)}</h2>
          <p>${flight.to.code}</p>
        </div>
      </div>

      <div class="flight-card-right">
        <h2>$${flight.price.economy}</h2>
        <p>Economy</p>
        <p>$${flight.price.business} Business</p>
        <button class="select-btn">Select</button>
      </div>
    `;

    container.appendChild(card);
  });
}



document.getElementById("searchBtn").addEventListener("click", async () => {

  const fromValue = document.getElementById("fromInput").value.trim();
  const toValue = document.getElementById("toInput").value.trim();

  const airports = await fetch("data/airports.json").then(res => res.json());

  const fromAirport = airports.find(a =>
    a.city.toLowerCase() === fromValue.toLowerCase() ||
    a.code.toLowerCase() === fromValue.toLowerCase()
  );

  const toAirport = airports.find(a =>
    a.city.toLowerCase() === toValue.toLowerCase() ||
    a.code.toLowerCase() === toValue.toLowerCase()
  );

  if (!fromAirport || !toAirport) {
    alert("Invalid airport");
    return;
  }

  const filteredFlights = filterFlights(fromAirport.code, toAirport.code);

  document.getElementById("popularSection").style.display = "none";
  document.getElementById("resultsSection").style.display = "block";

  renderFlights(filteredFlights);

card.addEventListener("click", () => {
  showResults(deal.from.code, deal.to.code);
})
});