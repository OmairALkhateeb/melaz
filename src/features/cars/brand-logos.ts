/**
 * Real brand logos bundled under /public/brands/*.png (transparent, official
 * marks). Maps an API brand string to its local logo, or null when we don't
 * have one (the UI falls back to a generic icon).
 */
const AVAILABLE = new Set([
  "audi",
  "bmw",
  "ford",
  "hyundai",
  "kia",
  "lexus",
  "mercedes-benz",
  "nissan",
  "porsche",
  "toyota",
  "honda",
  "chevrolet",
  "volkswagen",
  "mazda",
  "mitsubishi",
  "suzuki",
  "jeep",
  "land-rover",
  "jaguar",
  "volvo",
  "peugeot",
  "renault",
  "mini",
  "tesla",
  "gmc",
  "dodge",
  "infiniti",
  "genesis",
  "mg",
  "skoda",
  "seat",
  "fiat",
  "opel",
  "subaru",
  "cadillac",
  "chrysler",
  "maserati",
  "bentley",
  "ferrari",
  "lamborghini",
]);

const ALIASES: Record<string, string> = {
  mercedes: "mercedes-benz",
  "mercedes benz": "mercedes-benz",
  benz: "mercedes-benz",
  vw: "volkswagen",
  "land rover": "land-rover",
  "range rover": "land-rover",
  chevy: "chevrolet",
};

export function brandLogoSrc(brand?: string | null): string | null {
  if (!brand) return null;
  const key = brand.trim().toLowerCase();
  const resolved = ALIASES[key] ?? key;
  const slug = resolved.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return AVAILABLE.has(slug) ? `/brands/${slug}.png` : null;
}
