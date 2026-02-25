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
