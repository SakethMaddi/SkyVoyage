const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api";

async function handleJson(res) {
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json();
}

export async function getFlights() {
  const res = await fetch(`${BASE_URL}/flights`);
  return handleJson(res);
}

export async function getSeatMaps() {
  const res = await fetch(`${BASE_URL}/seats`);
  return handleJson(res);
}

export async function getPromos() {
  const res = await fetch(`${BASE_URL}/promos`);
  return handleJson(res);
}

export async function postBooking(bookingData) {
  const res = await fetch(`${BASE_URL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  return handleJson(res);
}

export async function getBookingsFromServer() {
  const res = await fetch(`${BASE_URL}/bookings`);
  return handleJson(res);
}
