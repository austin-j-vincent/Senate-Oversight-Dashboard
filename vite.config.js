import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Served from a GitHub Pages project site: https://<user>.github.io/<repo>/
const base = "/Senate-Oversight-Dashboard/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Senate Oversight Contact Directory",
        short_name: "Senate Directory",
        description:
          "119th Congress Senate committee rosters with phone numbers and DC office addresses.",
        // both mirror --bg-navy in src/index.css; keep in sync (manifest JSON can't use CSS vars)
        theme_color: "#060d18",
        background_color: "#060d18",
        display: "standalone",
        scope: base,
        start_url: base,
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
