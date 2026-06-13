/**
 * Real car photos per body type, bundled under /public/body-types/*.jpg.
 * Maps an API body-type value to its representative photo, or null when we
 * don't recognise it (the UI falls back to a neutral tile).
 */
type Shape =
  | "sedan"
  | "suv"
  | "crossover"
  | "hatchback"
  | "coupe"
  | "convertible"
  | "wagon"
  | "pickup"
  | "van";

function resolveShape(value: string): Shape | null {
  const v = value.toLowerCase();
  if (v.includes("suv")) return "suv";
  if (v.includes("crossover")) return "crossover";
  if (v.includes("hatch")) return "hatchback";
  if (v.includes("coupe")) return "coupe";
  if (v.includes("convertible") || v.includes("cabrio") || v.includes("roadster"))
    return "convertible";
  if (v.includes("wagon") || v.includes("estate") || v.includes("touring") || v.includes("avant"))
    return "wagon";
  if (v.includes("pickup") || v.includes("truck")) return "pickup";
  if (v.includes("van") || v.includes("mini") || v.includes("bus")) return "van";
  if (v.includes("sedan") || v.includes("saloon")) return "sedan";
  return null;
}

export function bodyTypePhotoSrc(value?: string | null): string | null {
  if (!value) return null;
  const shape = resolveShape(value);
  return shape ? `/body-types/${shape}.jpg` : null;
}
