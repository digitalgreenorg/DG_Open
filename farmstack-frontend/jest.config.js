module.exports = {
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    "\\.(svg)$": "jest-svg-transformer",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!.*\\.(js|jsx|ts|tsx|css|less|svg)$)",
  ],
};
