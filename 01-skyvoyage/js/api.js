// Mock API utility — create a function that loads JSON data and simulates network delay


export async function getFlights() {
  const response = await fetch("data/flights.json");
  return await response.json();
}

export async function getAirports() {
  const response = await fetch("data/airports.json");
  return await response.json();
}

export async function getPromos() {
  const response = await fetch("data/promos.json");
  return await response.json();
}

export async function seatMaps() {
  const response = await fetch("data/seat-maps.json");
  return await response.json();
}