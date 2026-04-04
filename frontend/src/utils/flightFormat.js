export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

export function formatStops(stops) {
  if (stops === 0) return "Direct";
  if (stops === 1) return "1 Stop";
  return `${stops} stops`;
}
