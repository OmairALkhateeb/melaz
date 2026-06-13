import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Layout route for /cars — renders child index (listing) or $slug (detail). */
export const Route = createFileRoute("/cars")({
  component: CarsLayout,
});

function CarsLayout() {
  return <Outlet />;
}
