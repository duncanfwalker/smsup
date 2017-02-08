const webpack       = require("webpack");
const nodeExternals = require("webpack-node-externals");
const path          = require("path");
const fs            = require("fs");
const entryFile = "./bin/start-server.js";
const outputPath = path.resolve(__dirname, "./build");

module.exports = {
  target:  "node",
  cache:   false,
  context: __dirname,
  devtool: "source-map",
  entry:   entryFile,
  output:  {
    path:          outputPath,
    filename:      "bundle.js"
  },
  module:  {
    loaders: [
      {test: /\.json$/, loaders: ["json-loader"]},
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }   ],
    noParse: /\.min\.js/
  },
  externals: [nodeExternals()],
  node:    {
    __dirname: false,
    fs:        "empty"
  }
};