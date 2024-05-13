// src/setupTests.js
import { server } from "./mocks/server";
require("dotenv").config({ path: ".env.test" });

// Establish API mocking before all tests.
beforeAll(() => {
  console.log("inside server");
  server.listen();
});

// Reset any request handlers that we may add du ring the tests,
// so they don't affect other tests.
afterEach(() => {
  console.log("after each");
  server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(() => server.close());
