const base = "http://localhost:3001/api";

const defaultOpts = {
  credentials: "include",
};

async function parseJson(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function getFlights() {
  const res = await fetch(`${base}/flights`, defaultOpts);
  if (!res.ok) throw new Error("Failed to load flights");
  return res.json();
}

export async function getAirports() {
  const res = await fetch(`${base}/airports`, defaultOpts);
  if (!res.ok) throw new Error("Failed to load airports");
  return res.json();
}

export async function getPromos() {
  const res = await fetch(`${base}/promos`, defaultOpts);
  if (!res.ok) throw new Error("Failed to load promos");
  return res.json();
}

export async function getSeatMaps() {
  const res = await fetch(`${base}/seat-maps`, defaultOpts);
  if (!res.ok) throw new Error("Failed to load seat maps");
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${base}/auth/me`, defaultOpts);
  if (!res.ok) throw new Error("Failed to load session");
  return res.json();
}

export async function loginRequest(email, password) {
  const res = await fetch(`${base}/auth/login`, {
    ...defaultOpts,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function registerRequest(name, email, password) {
  const res = await fetch(`${base}/auth/register`, {
    ...defaultOpts,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}

export async function logout() {
  const res = await fetch(`${base}/auth/logout`, {
    ...defaultOpts,
    method: "POST",
  });

  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}

export async function getBookingFlow() {
  const res = await fetch(`${base}/session/booking-flow`, defaultOpts);
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to load booking flow");
  return res.json();
}

export async function putBookingFlow(partial) {
  const res = await fetch(`${base}/session/booking-flow`, {
    ...defaultOpts,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partial),
  });

  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to save booking flow");
  return res.json();
}

export async function getMyBookings() {
  const res = await fetch(`${base}/bookings`, defaultOpts);
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to load bookings");
  return res.json();
}

export async function createBooking(payload) {
  const res = await fetch(`${base}/bookings`, {
    ...defaultOpts,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(res);
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error(data.error || "Booking failed");
  return data;
}