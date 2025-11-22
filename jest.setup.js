// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Ensure we're using development React for tests
// This prevents "act(...) is not supported in production builds" error
if (process.env.NODE_ENV !== 'test') {
  process.env.NODE_ENV = 'test'
}

