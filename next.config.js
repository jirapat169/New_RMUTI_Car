const path = require("path");
const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");

const basePath = "/vrs";

module.exports = withCSS(
  withSass({
    basePath: basePath,
    sassOptions: {
      includePaths: [path.join(__dirname, "styles")],
    },
    trailingSlash: true,
    env: {
      mode: process.env.MODE,
      basePath: basePath,
    },
  })
);
