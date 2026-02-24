# SkyVoyage — Flight Booking Platform

Build a flight search and booking platform from scratch using vanilla JavaScript, HTML, and CSS.

## Live Demo

[View the finished product](#) <!-- Link will be updated after deployment -->

Use the live demo to understand how the finished product should look and work. Explore every page, try every feature, and pay attention to the details.

## Setup

1. Navigate to this directory in your terminal
2. Run `npx serve .` to start a local dev server
3. Open the URL shown in your terminal (usually `http://localhost:3000`)

> **Note:** You must use a local server (not open the HTML file directly) because `fetch()` doesn't work with the `file://` protocol.

## Pages

| Page | File | Description |
|------|------|-------------|
| Search | `index.html` | Flight search form, results with filtering/sorting |
| Seats | `seats.html` | Seat map selection and passenger details |
| Booking | `booking.html` | Payment and booking confirmation |
| Confirmation | `confirmation.html` | Booking confirmed with ticket number |
| History | `history.html` | View past bookings |

## Data

Your flight data, airport data, seat maps, and promo codes are in the `data/` folder as JSON files. Load these in your JavaScript code to simulate API calls.

| File | Contains |
|------|----------|
| `data/flights.json` | 50 flight records with routes, prices, times |
| `data/airports.json` | 30 world airports with codes and cities |
| `data/seat-maps.json` | Seat configurations for 5 aircraft types |
| `data/promos.json` | 6 promo codes with discount rules |

## Guide

Open **`CONCEPTS.md`** for feature descriptions and progressive hints.

The hints are organized in 3 levels:
- **Level 1** (visible) — Feature description that hints at what to build
- **Level 2** (expandable) — Thinking questions to guide your approach
- **Level 3** (expandable) — Direct concept names when you're stuck

Try to solve each feature using only Level 1 first!
