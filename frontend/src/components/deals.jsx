const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#eab308",
  "#ec4899",
];

function countFlights(fromCity, toCity, flights) {
  return flights.filter(
    (f) => f.from.city === fromCity && f.to.city === toCity
  ).length;
}

export default function Deals({ deals, allFlights, onDealClick }) {
  return (
    <section className="deals" id="dealsSection">
      <div className="deals_section">
        <h2 className="deals_h2">Popular Destinations</h2>
        <p className="deals_p">
          Explore trending routes with great deals
        </p>
        <div className="deals-container" id="hotdealsContainer">
          {deals.map((deal, index) => {
            const flightTotal = countFlights(
              deal.from.city,
              deal.to.city,
              allFlights
            );
            return (
              <div
                key={`${deal.from.code}-${deal.to.code}-${index}`}
                className="deal-card"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                onClick={() => onDealClick(deal.from.code, deal.to.code)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    onDealClick(deal.from.code, deal.to.code);
                }}
              >
                <div className="card-top">
                  <span className="tag">{deal.tag || "Deal"}</span>
                  <h2>
                    {deal.from.city} → {deal.to.city}
                  </h2>
                  <p>
                    {deal.from.code} — {deal.to.code}
                  </p>
                </div>
                <div className="card-bottom">
                  <h3>From ${deal.price.economy}</h3>
                  <p>{flightTotal} flights daily</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
