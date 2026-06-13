import { z } from "zod";

const localizedStringSchema = z.union([
  z.string(),
  z.object({ ar: z.string().optional(), en: z.string().optional() }),
]);

export const carImageSchema = z
  .object({
    id: z.number().optional(),
    url: z.string(),
    alt: z.string().nullable().optional(),
    alt_text: z.string().nullable().optional(),
    is_primary: z.boolean().optional(),
    sort_order: z.number().optional(),
  })
  .transform(({ alt_text, alt, ...rest }) => ({
    ...rest,
    alt: alt ?? alt_text ?? null,
  }));

export const carSchema = z
  .object({
    id: z.number(),
    slug: z.string(),
    title: localizedStringSchema,
    brand: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    trim: z.string().nullable().optional(),
    year: z.number().nullable().optional(),
    price: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),
    mileage: z.number().nullable().optional(),
    fuel_type: z.string().nullable().optional(),
    transmission: z.string().nullable().optional(),
    body_type: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    origin: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    engine_size: z.string().nullable().optional(),
    drivetrain: z.string().nullable().optional(),
    condition: z.string().nullable().optional(),
    whatsapp_number: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    featured_image: z.string().nullable().optional(),
    images: z.array(carImageSchema).optional(),
    description: localizedStringSchema.nullable().optional(),
    specs: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .passthrough();

export const paginationMetaSchema = z.object({
  current_page: z.number(),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  from: z.number().nullable().optional(),
  to: z.number().nullable().optional(),
});

export const paginationLinksSchema = z
  .object({
    first: z.string().nullable().optional(),
    last: z.string().nullable().optional(),
    prev: z.string().nullable().optional(),
    next: z.string().nullable().optional(),
  })
  .optional();

export const paginatedCarsSchema = z.object({
  data: z.array(carSchema),
  meta: paginationMetaSchema,
  links: paginationLinksSchema,
});

export const carFilterOptionSchema = z.object({
  value: z.string(),
  label: localizedStringSchema.optional(),
  count: z.number().optional(),
});

export const carFilterRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const carFiltersSchema = z
  .object({
    brands: z.array(carFilterOptionSchema).optional(),
    models: z.array(carFilterOptionSchema).optional(),
    fuel_types: z.array(carFilterOptionSchema).optional(),
    transmissions: z.array(carFilterOptionSchema).optional(),
    body_types: z.array(carFilterOptionSchema).optional(),
    colors: z.array(carFilterOptionSchema).optional(),
    origins: z.array(carFilterOptionSchema).optional(),
    cities: z.array(carFilterOptionSchema).optional(),
    conditions: z.array(carFilterOptionSchema).optional(),
    years: carFilterRangeSchema.optional(),
    prices: carFilterRangeSchema.optional(),
    mileage: carFilterRangeSchema.optional(),
  })
  .passthrough();

/** Laravel may wrap a single resource as { data: car } */
export const carResponseSchema = z.union([
  carSchema,
  z.object({ data: carSchema }).transform((v) => v.data),
]);
