/**
 * VIEW - card 6. The only place in the application that knows how a date is
 * spelled out. Swap it for `Intl.DateTimeFormat` and nothing else moves.
 */
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const formatDate = (value: Date): string =>
  `${MONTHS[value.getMonth()]} ${value.getDate()}, ${value.getFullYear()}`;

export const formatTime = (value: Date): string =>
  `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;
