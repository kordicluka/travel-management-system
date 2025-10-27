import { defineConfig } from "tsup";
import { glob } from "glob";

const moduleEntries = glob.sync("src/*/index.ts");

export default defineConfig({
  entry: ["src/index.ts", ...moduleEntries],
  format: ["cjs", "esm"],
  dts: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  treeshake: true,
  splitting: true,
  outDir: "dist",
});
