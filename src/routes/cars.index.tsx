import { createFileRoute } from "@tanstack/react-router";
import { CarsPage } from "@/features/cars/CarsPage";
import { parseCarsSearch, carsSearchToListParams } from "@/features/cars/filter-search";
import { carsListQueryOptions } from "@/lib/api/queries";
import { CARS_PER_PAGE } from "@/features/cars/utils";
import type { CarsListResponse } from "@/lib/api/types";

export const Route = createFileRoute("/cars/")({
  validateSearch: (search) => parseCarsSearch(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps: search }) => {
    const listParams = carsSearchToListParams(search, CARS_PER_PAGE);
    try {
      return await context.queryClient.ensureQueryData(carsListQueryOptions(listParams));
    } catch {
      // Let the component fetch on the client and render the in-page error state
      // instead of crashing the whole route with the error boundary.
      return undefined;
    }
  },
  component: CarsRoute,
  head: () => ({
    meta: [
      { title: "Available Cars — AL MELAZ MOTORS" },
      {
        name: "description",
        content: "Browse cars currently available at AL MELAZ MOTORS — photos, specs and prices.",
      },
      { property: "og:title", content: "Available Cars — AL MELAZ MOTORS" },
      {
        property: "og:description",
        content: "Browse cars currently available at AL MELAZ MOTORS.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function CarsRoute() {
  const search = Route.useSearch();
  const initialData = Route.useLoaderData() as CarsListResponse | undefined;
  return <CarsPage search={search} initialData={initialData} />;
}
