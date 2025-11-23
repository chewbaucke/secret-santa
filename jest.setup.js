// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Ensure we're using development React for tests
// This prevents "act(...) is not supported in production builds" error
// Note: NODE_ENV is already set to 'test' by the test script in package.json
process.env.NODE_ENV = 'test'

