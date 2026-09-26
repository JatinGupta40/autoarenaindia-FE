export function formatINR(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "—";
  return `₹ ${num.toLocaleString("en-IN")}`;
}

/** Indian car listings conventionally show price in Lakh, e.g. "₹ 9.99 Lakh". */
export function formatPriceLakh(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "—";
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  return `₹ ${(num / 100000).toFixed(2)} Lakh`;
}

export function formatGenerationRange(start: number, end: number | null) {
  return end ? `${start}–${end}` : `${start}–Present`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Price split for display with a large figure and a small unit, e.g. { amount: "9.99", unit: "Lakh" }. */
export function priceParts(value: number | string | null | undefined): { amount: string; unit: string } | null {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return null;
  if (num >= 10000000) return { amount: (num / 10000000).toFixed(2), unit: "Cr" };
  return { amount: (num / 100000).toFixed(2), unit: "Lakh" };
}

export function joinNames(terms: { name: string }[] | null | undefined, fallback = "—") {
  return terms?.map((t) => t.name).join(", ") || fallback;
}

/** "18.20" → "18.2"; drops the trailing zeros decimal fields come back with. */
function trimNumber(value: number | string) {
  return String(Number(value));
}

/**
 * Min–max of a numeric spec across variants, e.g. "998–1497 cc", or a single value when they
 * agree. Without a unit it returns the bare figure(s), for components that render the unit.
 */
export function formatRange(values: (number | string | null | undefined)[], unit = "", fallback = "—") {
  const nums = values
    .filter((v) => v !== null && v !== undefined && v !== "")
    .map(Number)
    .filter((n) => !Number.isNaN(n));
  if (!nums.length) return fallback;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = min === max ? trimNumber(min) : `${trimNumber(min)}–${trimNumber(max)}`;
  return unit ? `${range} ${unit}` : range;
}
