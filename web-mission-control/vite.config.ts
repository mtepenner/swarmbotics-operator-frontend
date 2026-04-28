import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@teleop": path.resolve(__dirname, "../teleoperation-fallback/index.ts"),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "..")] ,
    },
  },
});
