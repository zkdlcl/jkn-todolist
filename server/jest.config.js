module.exports = {
  testEnvironment: "node",
  coverageProvider: "v8",
  collectCoverageFrom: ["src/**/*.js", "!src/config/**", "!src/**/*.test.js"],
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
  testTimeout: 10000,
};
