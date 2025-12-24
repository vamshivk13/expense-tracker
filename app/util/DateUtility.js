export const getFormattedDate = (date) => {
  const dt = new Date(date);
  const monthLong = dt.toLocaleString("default", { month: "short" });
  const yearShort = dt.getFullYear();

  const day = String(dt.getDate()).padStart(2, "0");

  return day + " " + monthLong + " " + yearShort;
};

export const getFormattedDateWithWeekday = (date) => {
  const dt = new Date(date);
  if (isNaN(dt)) return ""; // handle invalid dates gracefully

  const monthShort = dt.toLocaleString("default", { month: "short" });
  const weekdayLong = dt.toLocaleString("default", { weekday: "short" });
  const day = String(dt.getDate()).padStart(2, "0");

  return `${day} ${monthShort}, ${weekdayLong}`;
};

export const getFormattedDateShort = (date) => {
  const dt = new Date(date);
  const monthLong = dt.toLocaleString("default", { month: "short" });
  const yearShort = dt.getFullYear().toString().slice(2);

  const day = String(dt.getDate()).padStart(2, "0");

  return day + " " + monthLong + " " + yearShort;
};

export const getFormattedAmount = (amount) => {
  return "₹" + amount;
};
