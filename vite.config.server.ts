import { defineConfig, loadEnv } from "vite";
import path from "path";

// Server build configuration
export default defineConfig(({ mode }) => {
  // Load env variables - need to explicitly load them for server build
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "server/node-build.ts"),
        name: "server",
        fileName: "production",
        formats: ["es"],
      },
      outDir: "dist/server",
      target: "node22",
      ssr: true,
      rollupOptions: {
        external: [
          // Node.js built-ins
          "fs",
          "path",
          "url",
          "http",
          "https",
          "os",
          "crypto",
          "stream",
          "util",
          "events",
          "buffer",
          "querystring",
          "child_process",
          // External dependencies that should not be bundled
          "express",
          "cors",
          "dotenv",
        ],
        output: {
          format: "es",
          entryFileNames: "[name].mjs",
        },
      },
      minify: false, // Keep readable for debugging
      sourcemap: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
    define: {
      "process.env.NODE_ENV": '"production"',
      // Expose GROQ_API_KEY at build time - this makes it available in the bundled code
      "process.env.GROQ_API_KEY": JSON.stringify(env.GROQ_API_KEY || process.env.GROQ_API_KEY || ''),
    },
  };
});

