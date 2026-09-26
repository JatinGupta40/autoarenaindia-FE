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
