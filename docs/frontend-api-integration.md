# Frontend API Integration

This document describes how the AL MELAZ MOTORS frontend connects to the Laravel backend API.

The frontend is a **public, read-only** car marketplace. There is **no login or registration** in the website.

---

## 1. Required environment variables

Create a `.env` file in the project root (copy from `.env.example`):

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | **Yes** | Laravel API origin (no trailing slash) | `http://melaz-motors.livetech.it.com` |
| `VITE_WHATSAPP_NUMBER` | Recommended | Default business WhatsApp (international digits) | `963941885966` |
| `VITE_SITE_URL` | Optional | Public site URL for WhatsApp message links | `https://almelazmotors.com` |

**Notes**

- Vite exposes only variables prefixed with `VITE_`.
- Restart the dev server after changing `.env`.
- Production builds embed env values at build time — set them in your hosting/CI environment.

---


## 2. API endpoints used

All requests are `GET` with `Accept: application/json`.

| Endpoint | Purpose | Frontend usage |
|----------|---------|----------------|
| `GET /api/cars` | Paginated car listing + filters | `/cars` listing page |
| `GET /api/cars/{slug}` | Single car by slug | `/cars/{slug}` detail page |
| `GET /api/car-filters` | Filter metadata (brands, models, ranges…) | Listing filters sidebar/drawer |

**Base URL resolution**

```
{VITE_API_BASE_URL}/api/cars?page=1&per_page=12&sort=newest
```

Implementation: `src/lib/api/client.ts` → `src/lib/api/cars.ts`

---

## 3. Filter query params

URL search params on `/cars` are mapped to API query params by `src/features/cars/filter-search.ts` → `carsSearchToListParams()`.

| UI filter | URL param | API param |
|-----------|-----------|-----------|
| Search | `search` | `search` |
| Brand | `brand` | `brand` |
| Model | `model` | `model` |
| Body type | `body_type` | `body_type` |
| Color | `color` | `color` |
| Year min / max | `year_min`, `year_max` | `year_min`, `year_max` |
| Price min / max | `price_min`, `price_max` | `price_min`, `price_max` |
| Origin | `origin` | `origin` |
| Mileage min / max | `mileage_min`, `mileage_max` | `mileage_min`, `mileage_max` |
| Transmission | `transmission` | `transmission` |
| Fuel type | `fuel_type` | `fuel_type` |
| Condition | `condition` | `condition` |
| City | `city` | `city` |
| Sort | `sort` | `sort` |
| Page | `page` | `page` |
| — | — | `per_page` (always `12`) |

**Sort values (URL → API)**

| URL value | API value | Meaning |
|-----------|-----------|---------|
| `newest` | `newest` | Default |
| `oldest` | `oldest` | Oldest first |
| `price_asc` | `price_low` | Price low → high |
| `price_desc` | `price_high` | Price high → low |
| `mileage_asc` | `mileage_low` | Mileage low → high |
| `mileage_desc` | `mileage_high` | Mileage high → low |
| `year_desc` | `year_new` | Newer year |
| `year_asc` | `year_old` | Older year |

Mapping: `src/lib/api/sort-map.ts`

**Filter metadata**

`GET /api/car-filters?brand=Toyota` — optional `brand` param; Laravel returns `models_by_brand` which the frontend normalizes to `models`.

Range fields from Laravel (`year_range`, `price_range`, `mileage_range`) are normalized to `years`, `prices`, and `mileage`.

**Example**

```
/cars?brand=Toyota&year_min=2018&sort=price_asc&page=2
```

→

```
GET /api/cars?brand=Toyota&year_min=2018&sort=price_asc&page=2&per_page=12
```

---

## 4. Car data shape expected

The frontend validates responses with Zod (`src/lib/api/schemas.ts`).

### Single car

```json
{
  "id": 1,
  "slug": "toyota-camry-2022",
  "title": { "ar": "...", "en": "..." },
  "brand": "Toyota",
  "model": "Camry",
  "trim": "SE",
  "year": 2022,
  "price": 45000000,
  "currency": "SYP",
  "mileage": 45000,
  "fuel_type": "petrol",
  "transmission": "automatic",
  "body_type": "sedan",
  "color": "white",
  "origin": "Japan",
  "city": "Damascus",
  "engine_size": "2.5L",
  "drivetrain": "FWD",
  "condition": "used",
  "whatsapp_number": "963941885966",
  "status": "available",
  "featured_image": "/storage/cars/photo.jpg",
  "images": [
    { "url": "/storage/cars/photo.jpg", "alt": "Front view", "is_primary": true }
  ],
  "description": { "ar": "...", "en": "..." },
  "specs": { "doors": 4 },
  "created_at": "2026-01-15T10:00:00Z"
}
```

### Paginated list

```json
{
  "data": [ /* car objects */ ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 12,
    "total": 48,
    "from": 1,
    "to": 12
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  }
}
```

### Filter metadata

```json
{
  "brands": [{ "value": "Toyota", "label": "Toyota", "count": 12 }],
  "models": [{ "value": "Camry", "label": "Camry", "count": 4 }],
  "years": { "min": 2005, "max": 2024 },
  "prices": { "min": 10000000, "max": 80000000 },
  "mileage": { "min": 0, "max": 300000 }
}
```

**Optional fields**

All fields except `id`, `slug`, and `title` may be omitted or `null`. The UI hides empty values gracefully.

**Images**

- Laravel may return **relative** paths (`/storage/...`).
- The frontend resolves them to absolute URLs using `VITE_API_BASE_URL` (`src/lib/api/media.ts`).
- Absolute `https://` URLs from CDN/storage are used as-is.

**WhatsApp**

- Uses `car.whatsapp_number` when present.
- Falls back to `VITE_WHATSAPP_NUMBER`.

---

## 5. How to test locally

### Prerequisites

1. Laravel API running locally (default `http://localhost:8000`).
2. CORS enabled on Laravel for the frontend origin (e.g. `http://localhost:5173`).
3. Node.js installed.

### Steps

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env
#    VITE_API_BASE_URL=http://localhost:8000
#    VITE_WHATSAPP_NUMBER=963941885966

# 3. Install & run
npm install
npm run dev
```

Open `http://localhost:5173/cars`.

### Manual checks

| Check | Expected |
|-------|----------|
| Listing loads | Cars appear from API |
| Filters | URL updates; API called with query params |
| Pagination | Page changes; results update |
| Detail page | `/cars/{slug}` loads single car |
| Images | Relative `/storage/...` paths display |
| WhatsApp | Opens wa.me with car title + link |
| Empty list | Empty state with optional clear filters |
| API offline | Error state with retry |
| Slow network | Previous results stay visible while updating |
| 404 slug | “Car not found” page |

### Verify API directly

```bash
curl "http://localhost:8000/api/cars?per_page=12&sort=newest"
curl "http://localhost:8000/api/cars/your-car-slug"
curl "http://localhost:8000/api/car-filters"
```

---

## 6. Switch from local to production API

### Development against production API

Edit `.env`:

```env
VITE_API_BASE_URL=http://melaz-motors.livetech.it.com
VITE_SITE_URL=https://almelazmotors.com
VITE_WHATSAPP_NUMBER=963941885966
```

Restart `npm run dev`.

Ensure Laravel CORS allows your local origin if testing from localhost.

### Production deployment

Set environment variables in your hosting platform **before** running `npm run build`:

```env
VITE_API_BASE_URL=http://melaz-motors.livetech.it.com
VITE_SITE_URL=https://almelazmotors.com
VITE_WHATSAPP_NUMBER=963941885966
```

Then:

```bash
npm run build
npm run preview   # optional local preview of production build
```

Deploy the build output to Cloudflare Workers / your host.

**Important:** `VITE_*` values are baked into the build. Changing them requires a rebuild.

---

## Architecture reference

```
src/lib/api/
├── client.ts          # fetch wrapper, timeout, errors
├── cars.ts            # GET /api/cars, /api/cars/{slug}, /api/car-filters
├── media.ts           # resolve relative image URLs
├── normalize-car.ts   # normalize car records after parse
├── queries.ts         # React Query hooks
├── schemas.ts         # Zod validation
└── types.ts           # TypeScript interfaces

src/features/cars/
├── CarsPage.tsx           # Listing
├── CarDetailsPage.tsx     # Detail
└── filter-search.ts       # URL ↔ API param mapping
```

Routes:

- `/cars` → listing (`src/routes/cars.tsx`)
- `/cars/$slug` → detail (`src/routes/cars.$slug.tsx`)
