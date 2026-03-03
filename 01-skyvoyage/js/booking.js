if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "login.html";
}

const promoInput = document.querySelector(".promo_input");
const promoBtn = document.querySelector(".promo_btn");
const promoError = document.getElementById("promoError");
const promoSuccess = document.getElementById("promoSuccess");

const subtotal = document.getElementById("subtotal");
const discount = document.getElementById("discount");
const total = document.getElementById("total");

let originalTotal = 0;
document.addEventListener("DOMContentLoaded", loadBookingSummary);


if (promoBtn) {
  promoBtn.addEventListener("click", async () => {

    const enteredCode = promoInput.value.trim().toUpperCase();
    promoInput.classList.remove("input-error", "input-success");
    promoError.style.display = "none";
    promoSuccess.style.display = "none";

    if (!enteredCode) {
      showPromoError("Please enter a promo code");
      return;
    }

    try {
      const response = await fetch("data/promos.json");
      const promos = await response.json();

      const promo = promos.find(p =>
        p.code.toUpperCase() === enteredCode
      );

      if (!promo) {
        showPromoError("Invalid promo code");
        return;
      }

      let subtotal = parseFloat(subtotalEl.textContent);

      let discount = promo.type === "percentage"
        ? (subtotal * promo.value) / 100
        : promo.value;

      if (discount > subtotal) discount = subtotal;

      const finalTotal = subtotal - discount;

      discount.textContent = discount.toFixed(2);
      total.textContent = finalTotal.toFixed(2);

      showPromoSuccess(discount);

    } catch (err) {
      showPromoError("Error loading promo data");
    }
  });
}


function showPromoError(message) {
  promoInput.classList.add("input-error");
  promoError.textContent = message;
  promoError.style.display = "block";
  promoBtn.textContent = "Apply";
}

function showPromoSuccess(discount) {
  promoInput.classList.add("input-success");
  promoSuccess.textContent =
    `✓ $${discount.toFixed(2)} off your booking — You save $${discount.toFixed(2)}`;
  promoSuccess.style.display = "block";
  promoBtn.textContent = "Applied";
  promoBtn.disabled = true;
}

const payBtn = document.getElementById("payBtn");

function checkFormValidity() {
  const isValid =
    nameInput.classList.contains("input-success") &&
    cardInput.classList.contains("input-success") &&
    expiryInput.classList.contains("input-success") &&
    cvvInput.classList.contains("input-success");

  if (isValid) {
    payBtn.disabled = false;
    payBtn.classList.add("active");
  } else {
    payBtn.disabled = true;
    payBtn.classList.remove("active");
  }
}

// CARD VALIDATION


const nameInput = document.getElementById("cardName");
const cardInput = document.getElementById("cardNum");
const expiryInput = document.getElementById("card_exp");
const cvvInput = document.getElementById("card_cvv");

const nameError = document.getElementById("nameError");
const cardError = document.getElementById("cardError");
const expiryError = document.getElementById("expiryError");
const cvvError = document.getElementById("cvvError");


function showError(input, errorEl, message) {
  input.classList.add("input-error");
  input.classList.remove("input-success");
  errorEl.textContent = message;
  errorEl.style.display = "block";
}

function showSuccess(input, errorEl) {
  input.classList.remove("input-error");
  input.classList.add("input-success");
  errorEl.style.display = "none";
}


// Name
if (nameInput) {
  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim().length < 3) {
      showError(nameInput, nameError, "Enter a valid name");
    } else {
      showSuccess(nameInput, nameError);
    }
    checkFormValidity();
  });
}


// Card number
if (cardInput) {
  cardInput.addEventListener("input", () => {
    let value = cardInput.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    cardInput.value = value;

    if (value.replace(/\s/g, "").length < 16) {
      showError(cardInput, cardError, "Card number must be 16 digits");
    } else {
      showSuccess(cardInput, cardError);
    }
    checkFormValidity();
  });
}


// Expiry
if (expiryInput) {
  expiryInput.addEventListener("input", () => {
    let value = expiryInput.value.replace(/\D/g, "");
    value = value.substring(0, 4);

    if (value.length >= 3) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }

    expiryInput.value = value;

    if (value.length < 5) {
      showError(expiryInput, expiryError, "Enter valid date (MM/YY)");
      return;
    }

    const [monthStr, yearStr] = value.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear() % 100;

    if (month < 1 || month > 12) {
      showError(expiryInput, expiryError, "Month must be 01–12");
      return;
    }

    if (year < currentYear ||
      (year === currentYear && month < currentMonth)) {
      showError(expiryInput, expiryError, "Enter a valid future date (MM/YY)");
      return;
    }

    showSuccess(expiryInput, expiryError);
    checkFormValidity();
  });
}


// CVV
if (cvvInput) {
  cvvInput.addEventListener("input", () => {
    cvvInput.value = cvvInput.value.replace(/\D/g, "").substring(0, 3);

    if (cvvInput.value.length < 3) {
      showError(cvvInput, cvvError, "CVV must be 3 digits");
    } else {
      showSuccess(cvvInput, cvvError);
    }
    checkFormValidity();
  });
}


function loadBookingSummary() {
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));

  if (!bookingData) {
    console.error("No booking data found");
    return;
  }

  const {
    flight,
    seats,
    passengers,
    baseFare = 0,
    seatUpgrade = 0,
    totalPrice = 0,
    selectedDate
  } = bookingData;

  originalTotal = totalPrice;

  subtotal.textContent = originalTotal.toFixed(2);
  total.textContent = originalTotal.toFixed(2);
  discount.textContent = "0.00";

  renderFullSummary(
    flight,
    seats,
    passengers,
    baseFare,
    seatUpgrade,
    selectedDate
  );
}

function renderFullSummary(flight, seats, passengers, baseFare, seatUpgrade, selectedDate) {

  const summaryBox = document.querySelector(".booking_summary_box");

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "";

  const passengerNames = passengers
    .map(p => `${p.firstName} ${p.lastName}`)
    .join(", ");

  const seatType =
    seatUpgrade === 80
      ? "Business"
      : seatUpgrade === 40
      ? "Exit Row"
      : "Economy";

  const stopText =
    flight.stops === 0
      ? "Direct"
      : flight.stops === 1
      ? "1 Stop"
      : `${flight.stops} Stops`;

  const extraHTML = `
    <div class="summary-details">

      <div class="route-section">

        <div class="route-codes">
          <div class ="route_from">
            <span class="airport-code">${flight.from.code}</span>
            <p class="city-names">
            ${flight.from.city}
            </p>
          </div>
          <span class="arrow">→</span>
          <div class ="route_from">
            <span class="airport-code">${flight.to.code}</span>
            <p class="city-names">
            ${flight.to.city}
            </p>
          </div>
        </div>

        

        <div class="flight-info">
          <p>${flight.airline}</p>
          <p>${formattedDate}</p>
          <p>${flight.departureTime} - ${flight.arrivalTime}</p>
          <p>${flight.duration} · ${stopText}</p>
        </div>

      </div>

      <hr class="booking_line">

      <p class="booked_seat">SEATS</p>
      <div class="seat_fair">
        <p>${seats} (${seatType})<p>
        <p>$${Number(seatUpgrade).toFixed(2)}</p>
      </div>

      <hr class="booking_line">

      <p class="booked_seat"><strong>PASSANGERS</strong>
      <div class="seat_fair">
        <p>${passengerNames}</p>
        <p>${seats}</p>
      </div>

      <hr class="booking_line">

      <div class="booking_fairs">
        <p class="base_fair">Base fare</p>
        <p class="base_fair">$${Number(baseFare).toFixed(2)}</p>
      </div>
      <div class="booking_fairs">
        <p>Seat upgrade</p>
        <p>$${Number(seatUpgrade).toFixed(2)}</p>
      </div>
    </div>
  `;

  summaryBox.insertAdjacentHTML("afterbegin", extraHTML);
}





const confirmModal = document.getElementById("confirmModal");
const closeModal = document.getElementById("closeModal");
const goBackBtn = document.getElementById("goBackBtn");
const finalConfirmBtn = document.getElementById("finalConfirmBtn");
const modalRouteText = document.getElementById("modalRouteText");
const modalTotal = document.getElementById("modalTotal");


payBtn.addEventListener("click", () => {

  const bookingData = JSON.parse(localStorage.getItem("bookingData"));

  if (!bookingData) return;

  const { flight } = bookingData;

  modalRouteText.textContent =
    `You are about to book a flight from ${flight.from.code} to ${flight.to.code}.`;

  modalTotal.textContent = total.textContent;

  confirmModal.classList.add("active");
});


closeModal.addEventListener("click", () => {
  confirmModal.classList.remove("active");
});

goBackBtn.addEventListener("click", () => {
  confirmModal.classList.remove("active");
});


finalConfirmBtn.addEventListener("click", () => {


  confirmModal.classList.remove("active");


  payBtn.disabled = true;
  payBtn.classList.remove("active");
  payBtn.innerHTML = "⏳ Processing payment...";


  setTimeout(() => {


    showSuccessAlert("Booking confirmed!");


    setTimeout(() => {
      window.location.href = "confirmation.html";
    }, 1500);

  }, 2000);
});


const successAlert = document.getElementById("successAlert");
const closeAlert = document.getElementById("closeAlert");

function showSuccessAlert(message) {
  successAlert.querySelector("span").textContent = "✔ " + message;
  successAlert.classList.add("active");


  setTimeout(() => {
    successAlert.classList.remove("active");
  }, 3000);
}

closeAlert.addEventListener("click", () => {
  successAlert.classList.remove("active");
});