Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false, // You can change this value based on your use case
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});
