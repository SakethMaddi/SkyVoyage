const BASE_URL = "http://localhost:3000/api";

export const getFlights = async () => {
  const res = await fetch(`${BASE_URL}/flights`);
  return res.json();
};