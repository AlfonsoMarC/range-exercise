export const fetchRangeLimits = () =>
  fetch(`${process.env.API_URL}/rangeLimits`, { cache: "no-store" })
    .then(res => res.json())
    .catch(() => null);
