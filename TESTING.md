# Testing Guide

This project uses **Jest** and **React Testing Library** for testing, which is the recommended testing setup for Next.js applications.

## Test Framework: Jest + React Testing Library

### Why Jest?

- **Official Next.js recommendation** - Next.js has built-in support for Jest
- **Zero configuration** - Works out of the box with Next.js
- **Great TypeScript support** - Full type checking in tests
- **Fast and reliable** - Well-established ecosystem

### Why React Testing Library?

- **User-centric testing** - Tests how users interact with your app
- **Accessibility-focused** - Encourages accessible components
- **Simple API** - Easy to learn and use
- **Best practices** - Industry standard for React testing

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in the `__tests__` directory mirroring the source structure:

```
__tests__/
├── lib/
│   ├── secret-santa.test.ts      # Core algorithm tests
│   └── storage.test.ts            # localStorage utility tests
└── components/
    └── ParticipantManager.test.tsx  # Component tests
```

## What's Tested

### Core Algorithm (`lib/secret-santa.test.ts`)

- ✅ Basic functionality (2+ participants)
- ✅ Constraint handling (notAllowedNames)
- ✅ Error handling (too few participants, impossible constraints)
- ✅ Randomness verification
- ✅ Edge cases (large groups, overlapping constraints)

### Storage Utilities (`lib/storage.test.ts`)

- ✅ Saving to localStorage
- ✅ Loading from localStorage
- ✅ Error handling (invalid JSON)
- ✅ Empty state handling

### Components (`components/ParticipantManager.test.tsx`)

- ✅ Rendering (empty state, participant list)
- ✅ User interactions (adding, removing participants)
- ✅ Form submission (button click, Enter key)
- ✅ Input validation

## Writing New Tests

### Example: Testing a Utility Function

```typescript
import { myFunction } from '@/lib/my-utils';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

### Example: Testing a Component

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const mockHandler = jest.fn();
    render(<MyComponent onClick={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

## Best Practices

1. **Test user behavior, not implementation** - Focus on what users see and do
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Keep tests simple** - One assertion per test when possible
4. **Test error cases** - Verify graceful error handling
5. **Mock external dependencies** - Use mocks for localStorage, APIs, etc.

## Coverage

Current test coverage includes:
- ✅ Core secret santa algorithm (100% coverage)
- ✅ Storage utilities (100% coverage)
- ✅ ParticipantManager component (main interactions)

## Continuous Integration

Tests run automatically on:
- Local development (`npm test`)
- Before commits (recommended: use pre-commit hooks)
- CI/CD pipelines (Vercel runs tests on deploy)

## Troubleshooting

### Tests failing with "Cannot find module"

Make sure paths are correctly configured in `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### localStorage not available in tests

We mock localStorage in `__tests__/lib/storage.test.ts`. For other tests, you may need to add similar mocks.

### Component not rendering

Make sure you're using `'use client'` directive for client components, and check that all required props are provided.

