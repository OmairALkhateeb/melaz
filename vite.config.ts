// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy target: Vercel (static SPA).
// - cloudflare: false  → drop @cloudflare/vite-plugin so we don't build a Worker.
// - spa.enabled: true  → no SSR server; build a static client bundle + prerendered
//   shell that Vercel serves directly. The app fetches all data client-side from the
//   Laravel API, so SSR is not required for functionality.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    spa: { enabled: true },
  },
});
