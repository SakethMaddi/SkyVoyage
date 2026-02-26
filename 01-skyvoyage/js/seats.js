// Seat selection page logic — generate seat map, handle selection, passenger forms

 import { seatMaps } from "./api.js";   

let seats = [];

(async function () {
  seats = await seatMaps();
  console.log(seats);
})();