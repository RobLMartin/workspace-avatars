import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx", "src/styles.css"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: false,
  treeshake: true,
  external: ["react", "react-dom"],
  injectStyle: true,
  outExtension: ({ format }) => ({
    js: format === "cjs" ? ".cjs" : ".js",
  }),
});
