const page = document.body.dataset.page;

switch (page) {
  case "search":
    import("./search.js");
    break;

  case "booking":
    import("./booking.js");
    break;

  case "confirmation":
    import("./confirmation.js");
    break;
}
