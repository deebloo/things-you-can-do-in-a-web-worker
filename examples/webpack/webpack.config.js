const path = require("path");
const WorkerPlugin = require("worker-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "public/target"),
  },
  plugins: [new WorkerPlugin()],
};
