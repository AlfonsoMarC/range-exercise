export const fetchRangeValues = () =>
  fetch(`${process.env.API_URL}/rangeValues`, { cache: "no-store" })
    .then(res => res.json())
    .catch(() => null);
