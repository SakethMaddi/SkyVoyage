# SkyVoyage — Concept Guide

> This document describes what each feature should do. Read carefully —
> the way a feature is described often hints at how to build it.
>
> If you get stuck, expand the hint sections for guidance.

---

## Flow 1: Flight Search & Results

### 1.1 Airport Search Input

The departure and arrival fields should let users type an airport name or code. As the user types, a dropdown of matching airports should appear below the input. The list should update with every keystroke — but you should be mindful of performance. Firing a lookup on *every single keypress* would be wasteful. Instead, the system should wait until the user pauses typing before filtering the list.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: How can you delay a function call so it only runs after the user stops typing for a short period? What happens to the previous pending call when a new keystroke arrives?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **Debouncing** — wrapping a function with `setTimeout` and `clearTimeout` so it only executes after a pause. This pattern uses **closures** to remember the timeout ID between calls.
</details>

---

### 1.2 Fetching Flight Data

When the user submits the search form, the app should request flight data. Since there is no real backend, you will load data from a local JSON file. However, real APIs are not instant — your mock should simulate a short delay before returning data. During this delay, the user should see a loading indicator.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: How can you wrap a data-loading operation inside something that resolves after a deliberate delay? What mechanism lets you "pause" before resolving?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: Creating a **Promise** that uses `setTimeout` internally. Use `async/await` when calling your mock fetch function. The `fetch()` API can load local JSON files — combine it with a simulated delay.
</details>

---

### 1.3 Rendering Search Results

Each flight result should be rendered as a card showing the airline, times, duration, number of stops, and price. These cards must be generated entirely in JavaScript — do not write HTML cards by hand. Your code should take an array of flight objects and turn each one into a visible DOM element.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You have an array of objects. You need to transform each object into something else (a DOM element). What array method is designed for transforming every item in an array into something new?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.map()` to transform data into DOM elements. `document.createElement()` and `element.innerHTML` with **template literals** (backtick strings with `${expressions}`) for building HTML structures. Append results with `element.append()`.
</details>

---

### 1.4 Filtering Results

The filter panel should let users narrow results by price range, number of stops, and airline. When any filter changes, the displayed results should update immediately without re-fetching data. You already have the full dataset in memory — you need to narrow it down based on multiple criteria simultaneously.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need to keep only the items from an array that match certain conditions. Some conditions check numbers (price range), others check membership in a set (selected airlines). How do you chain multiple narrowing operations?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.filter()` with compound conditions. You can chain `.filter().filter()` or combine conditions with `&&` inside a single filter callback. For checking if a value is in a list, consider `Array.includes()` or `Set.has()`.
</details>

---

### 1.5 Sorting Results

Users should be able to sort by cheapest price, shortest duration, or "best" (a weighted combination). When the sort option changes, the same filtered dataset should re-arrange itself.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: How do you rearrange an array based on a comparison between items? The comparison logic changes depending on which sort option is selected. How can you store multiple comparison strategies and pick one dynamically?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.sort()` with a custom comparator function. For numeric sorts, `(a, b) => a.price - b.price`. Consider storing the comparator functions in an **object** keyed by sort type so you can look them up dynamically.
</details>

---

### 1.6 Pagination

Do not show all results at once. Display 10 results per page with navigation to move between pages. When the user changes pages, the view should show a different slice of the data.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: If you have 50 items and show 10 per page, page 3 starts at which item? How do you extract a portion of an array based on a start and end index?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.slice(start, end)` where `start = (page - 1) * perPage` and `end = start + perPage`. Calculate total pages with `Math.ceil(total / perPage)`.
</details>

---

### 1.7 Auto-Refresh Timer

Flight prices fluctuate. Display a visible countdown timer showing seconds until the next automatic refresh. When it reaches zero, re-fetch the results and restart the timer. If the user navigates away, the timer should stop to avoid unnecessary work.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need something that fires repeatedly at a fixed interval, and you need to be able to stop it. What two functions work as a pair for this?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `setInterval` to count down every second, and `clearInterval` to stop it. Store the interval ID in a variable so you can clear it later. Use the `beforeunload` event or page visibility API to clean up.
</details>

---

### 1.8 Detecting User Input Events

The search form should prevent default submission behavior and handle it with JavaScript instead. Individual filter checkboxes and range sliders should respond to changes in real time. Rather than attaching a listener to every single checkbox, consider a more efficient pattern.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: If you have 10 checkboxes inside a container, do you need 10 separate event listeners? Or can you listen on the parent and figure out which checkbox was changed?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `event.preventDefault()` for form submission. **Event delegation** — attach a single listener on a parent element and use `event.target` to identify the actual element that triggered the event.
</details>

---

## Flow 2: Flight Selection & Seat Booking

### 2.1 Reading the Selected Flight

When the user clicks "Select" on a flight card, they navigate to a new page. The seat selection page needs to know *which* flight was chosen. The flight ID should be part of the page URL so the user could bookmark or share the link.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: How do websites pass small pieces of data in a URL? After the `?` in a URL, there is a standard format for key-value pairs. How can JavaScript read those values from the current URL?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **URL query parameters**. Set them with `?flightId=FL-1001` when linking. Read them with `new URLSearchParams(window.location.search).get('flightId')`.
</details>

---

### 2.2 Generating the Seat Map

The seat map is a grid with rows (1-30) and columns (A-F). It must be generated entirely from data — not hardcoded in HTML. Each seat is a clickable element whose appearance depends on its status (available, occupied, selected) and tier (economy, business, exit row). The grid should have a gap to represent the aisle.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need a loop inside a loop — one for rows, one for columns. Each iteration creates one seat element. How do you decide what CSS class each seat gets? Where can you store metadata (row, column, tier) on the element itself so click handlers can read it?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **Nested for loops** or `forEach` to iterate rows and columns. Use `dataset` attributes (`data-row`, `data-col`) to store metadata on elements. Use `element.classList.add()` to set visual state. CSS Grid with `grid-template-columns` can create the seat layout including aisle gaps.
</details>

---

### 2.3 Seat Selection Logic

Clicking an available seat should toggle it between "selected" and "available." The maximum number of seats a user can select equals the number of passengers from the search form. Clicking an occupied seat should do nothing. The total price should update in real time as seats are selected or deselected, with business seats costing more than economy seats.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: Rather than attaching a click listener to every single seat, is there a way to put one listener on the parent container and figure out which seat was clicked? How do you maintain a list of currently selected seats and enforce a maximum?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **Event delegation** — one listener on the grid container, use `event.target.closest('.seat')` to identify the clicked seat. Maintain selected seats in an **Array**. Use `Array.push()`, `Array.filter()`, and `Array.length` to manage the list and enforce limits. Use **conditional (ternary) operators** to pick the price tier.
</details>

---

### 2.4 Seat Hold Countdown

Once the user selects their first seat, start a visible countdown timer (e.g., 5 minutes). If the timer runs out before they proceed, clear their selections and show a message. Warn the user when only 1 minute remains.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need to count down from 300 seconds, updating the display every second. How do you format seconds into "M:SS" format? How do you stop counting when a condition is met?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `setInterval` with a 1-second tick. `Math.floor(seconds / 60)` for minutes, `seconds % 60` for remaining seconds. `String.padStart(2, '0')` to zero-pad. `clearInterval` when time expires or user proceeds.
</details>

---

### 2.5 Passenger Details Form

For each passenger, display a form section collecting first name, last name, email, phone, passport number, and date of birth. The number of form sections should match the passenger count. Each field should validate as the user fills it in — not just on submit. Invalid fields should show an error message immediately below the input.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need to create N identical form sections, where N is known at runtime. What pattern lets you match text against a specific format (like an email address that must have an @ sign and a domain)? How do you react to user input in real time rather than waiting for form submission?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: A **loop** to create N form sections dynamically. **Regular expressions** (regex) for validation patterns — e.g., `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` for email. The `input` and `blur` **events** for real-time validation. `element.textContent` to show/hide error messages.
</details>

---

### 2.6 Passing Data Between Pages

The user's selections (flight, seats, passengers) need to survive navigation to the booking page. Since there is no server, you need a browser-side mechanism that persists data across page loads within the same browser tab but clears automatically when the tab is closed.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: The browser has built-in storage mechanisms. One persists forever, another only for the current tab session. Which one fits the booking flow? Since these mechanisms only store text, how do you save complex objects?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **sessionStorage** (clears when tab closes) vs **localStorage** (persists forever). Use `JSON.stringify()` to save objects and `JSON.parse()` to retrieve them. Wrap in **try/catch** for error handling (storage can be full or disabled).
</details>

---

## Flow 3: Booking & Payment

### 3.1 Booking Summary

Display a complete summary of the booking: flight details, passenger names, selected seats, and a price breakdown (base fare, seat upgrades, total). The seat upgrade total should be computed by summing up individual seat surcharges.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You have an array of seat objects, each with a surcharge value. You need to compute a single total from all those values. What array method is designed for "reducing" an array to a single value?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.reduce()` to sum values — `seats.reduce((sum, seat) => sum + seat.surcharge, 0)`. Use `Intl.NumberFormat` or a custom function for currency formatting.
</details>

---

### 3.2 Promo Code

Users can enter a promo code for a discount. The code should be validated against a list of valid codes from your data file. Only one promo can be applied per booking. After successful application, the discount should reflect in the price and the input should become disabled to prevent re-use.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need to remember whether a promo has already been applied, even across multiple clicks of the "Apply" button. What programming pattern lets a function "remember" state from previous calls without using global variables? How do you compare user input against known values while ignoring case differences?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **Closures** — a function that captures a variable (like `promoApplied`) from its outer scope and remembers it between calls. Use `String.toUpperCase()` for case-insensitive comparison. Use `Array.find()` to locate the matching promo code object.
</details>

---

### 3.3 Payment Form Validation

The payment form has: card number (16 digits), cardholder name, expiry date (MM/YY format), and CVV (3-4 digits). As the user types the card number, it should automatically insert spaces every 4 digits for readability. The expiry field should auto-insert the slash after the month digits. Validate all fields with specific format rules.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: Formatting input as the user types means intercepting each keystroke and modifying the value. What string methods let you remove all non-digit characters, then insert characters at specific positions? How do you test if a string matches an exact format?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `String.replace()` with **regex** to strip non-digits — `value.replace(/\D/g, '')`. Use `String.match(/.{1,4}/g).join(' ')` to insert spaces every 4 characters. `RegExp.test()` for validation. Listen to the `input` event for real-time formatting. **String.slice()** and **String.padStart()** for the expiry field.
</details>

---

### 3.4 Payment Processing Simulation

After the user clicks "Confirm & Pay," show a confirmation dialog asking if they're sure. If confirmed, display a loading spinner and simulate a 2-second processing delay. Then generate a unique ticket number and save the booking.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You need a delay that happens once (not repeatedly). How can you make code "wait" for a specified duration before continuing? The ticket number should be unique every time — combining the current timestamp with randomness would work.
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `setTimeout` for a one-time delay (or wrap in a **Promise** with `async/await`). `Date.now()` for a unique timestamp, `.toString(36)` to convert to compact alphanumeric, `Math.random().toString(36)` for randomness. Use **template literals** to combine prefix + timestamp + random into a ticket number.
</details>

---

### 3.5 Saving Bookings Permanently

Completed bookings should be stored so they appear in the booking history even if the user closes and reopens the browser. Each new booking should be added to the front of the list (newest first).

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: Unlike the booking flow data (which should vanish when the tab closes), completed bookings need to persist permanently. Which browser storage mechanism persists across sessions? How do you add an item to the beginning of an array?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: **localStorage** for permanent storage. `Array.unshift()` to add an item to the front of an array. Always read the existing array first, add the new item, then save the whole array back.
</details>

---

### 3.6 Booking History Display

A separate page should display all past bookings. Each booking shows the ticket number, route, date, and total price in a compact row. Clicking a booking should expand to show full details (passengers, seats, flight info). If there are no bookings, show a friendly empty state.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: You stored bookings as an array of objects. Now you need to turn each one into visible HTML. What if the array is empty — how do you handle that? For the expand/collapse behavior, what HTML element provides this natively without any JavaScript needed?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Array.forEach()` or `Array.map()` to iterate and create elements. **Conditional rendering** — check `array.length === 0` for empty state. The `<details>` / `<summary>` HTML elements for native expand/collapse. Or build custom toggle with `classList.toggle()`. Dynamic **table** generation for passenger lists.
</details>

---

### 3.7 Clear History with Confirmation

The "Clear All" button should ask the user for confirmation before deleting all bookings. Use a custom modal dialog, not the browser's built-in `confirm()`.

<details>
<summary><strong>Hint Level 2</strong></summary>

Think about: A modal needs to overlay the page, trap keyboard focus, and close on pressing Escape or clicking outside. What events let you detect these interactions?
</details>

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: Creating a **modal** with an overlay `<div>`, listening for `Escape` key via `keydown` event, and overlay clicks. For focus trapping, use `querySelectorAll` on focusable elements and cycle between first and last with the `Tab` key.
</details>

---

## Cross-Cutting Concepts

### Error Handling

Every data fetch can fail. Your mock API should occasionally simulate errors. Every place that calls the API should handle failure gracefully — show an error message to the user, never a blank page or an unhandled console error.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `try/catch` blocks around `await` calls. The mock API can randomly `reject()` its Promise. Display user-friendly error messages in the DOM.
</details>

---

### Toast Notifications

The app should show brief, auto-dismissing notification messages (e.g., "Promo code applied!", "Payment failed") that slide in from the side and disappear after a few seconds.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: Dynamically creating a `<div>`, appending to a container, using CSS transitions for animation, and `setTimeout` to auto-remove after 3 seconds.
</details>

---

### Page Routing

The app has 5 HTML pages. Your entry-point JavaScript file should detect which page is currently loaded and initialize only the relevant code. The body element has a `data-page` attribute to help with this.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `document.body.dataset.page` to read the current page. Store page-init functions in an **object** keyed by page name, then call the right one: `pageMap[currentPage]?.()`. The `?.` is **optional chaining**.
</details>

---

### Formatting & Display

Currency should display as "$450.00", durations as "7h 15m", and dates in a human-readable format. Avoid writing custom formatting logic when the browser has built-in tools for this.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `Intl.NumberFormat` for currency formatting, `Intl.DateTimeFormat` for date/time formatting. Write small utility functions and reuse them everywhere.
</details>

---

### State Management

Multiple parts of the app need access to the same data (selected flight, seats, passengers). Rather than scattering variables everywhere, centralize your app state in one place with controlled access.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: Creating a state module using the **closure pattern** — a factory function that returns `get()` and `set()` methods while keeping the actual state object private. Use `structuredClone()` to return deep copies and prevent external mutation.
</details>

---

### Accessibility

All interactive elements must be keyboard-navigable. The seat map should be usable without a mouse. Form fields need labels. Color should not be the only indicator of state.

<details>
<summary><strong>Hint Level 3</strong></summary>

Look into: `tabindex`, `aria-label`, `aria-selected`, `role` attributes. The `keydown` event for keyboard interaction. `<label for="">` on every form input. Semantic HTML elements like `<nav>`, `<main>`, `<aside>`.
</details>
