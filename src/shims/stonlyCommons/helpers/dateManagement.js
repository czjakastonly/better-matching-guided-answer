/** Shim: displayDate (default export). Handles unix seconds or ms. */
export default function displayDate(date) {
  if (!date) return '';
  const ms = typeof date === 'number' && date < 1e12 ? date * 1000 : date;
  return new Date(ms).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
