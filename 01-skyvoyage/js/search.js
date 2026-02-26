// Search page logic — handle flight search, display results, filtering, sorting, pagination

import { getFlights } from "./api.js";

let flights = [];

(async function () {
  flights = await getFlights();
  console.log(flights);
})();