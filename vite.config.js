import { defineConfig } from "vite";
import { markdownToHtml } from "./plugins/markdown";

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        service_worker: "service_worker.js",
        service_worker_utils: "service_worker_utils.js",
      },
      output: {
        entryFileNames: (assetInfo) => {
          if (assetInfo.name.startsWith("service_worker")) {
            return "[name].js";
          } else {
            return "assets/[name]-[hash].js";
          }
        },
      },
    },
  },
  plugins: [markdownToHtml()],
});
