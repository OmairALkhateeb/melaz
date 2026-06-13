import { createFileRoute } from "@tanstack/react-router";
import { CarsPage } from "@/features/cars/CarsPage";
import { parseCarsSearch, carsSearchToListParams } from "@/features/cars/filter-search";
import { carsListQueryOptions } from "@/lib/api/queries";
import { CARS_PER_PAGE } from "@/features/cars/utils";

export const Route = createFileRoute("/cars/")({
  validateSearch: (search) => parseCarsSearch(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps: search }) => {
    const listParams = carsSearchToListParams(search, CARS_PER_PAGE);
    await context.queryClient.ensureQueryData(carsListQueryOptions(listParams));
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
  return <CarsPage search={search} />;
}
