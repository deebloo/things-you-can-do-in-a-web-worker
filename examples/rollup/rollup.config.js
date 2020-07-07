import OMT from "@surma/rollup-plugin-off-main-thread";

export default {
  input: ["src/main.js"],
  output: {
    dir: "public/target",
    format: "amd",
  },
  plugins: [OMT()],
};
