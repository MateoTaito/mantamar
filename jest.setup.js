import '@testing-library/jest-dom'

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }
  observe(target) {
    this.elements.add(target);
    this.callback(
      [{ target, isIntersecting: true, intersectionRatio: 1 }],
      this
    );
  }
  unobserve(target) {
    this.elements.delete(target);
  }
  disconnect() {
    this.elements.clear();
  }
  takeRecords() {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver;

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver;
