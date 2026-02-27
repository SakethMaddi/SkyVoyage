

const promoInput = document.querySelector(".promo_input");
const promoBtn = document.querySelector(".promo_btn");
const promoError = document.getElementById("promoError");
const promoSuccess = document.getElementById("promoSuccess");

const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");

if (promoBtn) {
  promoBtn.addEventListener("click", async () => {

    const enteredCode = promoInput.value.trim().toUpperCase();

    // Reset UI
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

      discountEl.textContent = discount.toFixed(2);
      totalEl.textContent = finalTotal.toFixed(2);

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
  });
}