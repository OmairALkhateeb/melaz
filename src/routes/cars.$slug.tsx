import { createFileRoute } from "@tanstack/react-router";
import { CarDetailsPage } from "@/features/cars/CarDetailsPage";
import { getCarTitle, getCarPrimaryImage, getCarDescription } from "@/features/cars/utils";
import { carDetailQueryOptions } from "@/lib/api/queries";
import { isApiError } from "@/lib/api/client";
import type { Car } from "@/lib/api/types";

export const Route = createFileRoute("/cars/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(carDetailQueryOptions(params.slug));
    } catch (error) {
      if (isApiError(error) && error.status === 404) return null;
      throw error;
    }
  },
  head: ({ loaderData, params }) => {
    const car = loaderData as Car | null | undefined;
    const title = car ? getCarTitle(car, "en") : params.slug.replace(/-/g, " ");
    const description = car
      ? getCarDescription(car, "en") ?? getCarTitle(car, "en")
      : "Car details at AL MELAZ MOTORS";
    const image = car ? getCarPrimaryImage(car) : undefined;

    return {
      meta: [
        { title: `${title} — AL MELAZ MOTORS` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} — AL MELAZ MOTORS` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        ...(image ? [{ property: "og:image", content: image }] : []),
      ],
    };
  },
  component: CarDetailsRoute,
});

function CarDetailsRoute() {
  const { slug } = Route.useParams();
  const initialCar = Route.useLoaderData() as Car | null | undefined;
  return <CarDetailsPage slug={slug} initialCar={initialCar} />;
}
