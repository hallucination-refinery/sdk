# Error Handling & Logging Documentation

## Overview

The Refinery SDK employs a multi-layered error handling and logging strategy designed for development debugging and production monitoring. The system combines runtime validation through Zod schemas, React error boundaries, and environment-specific logging patterns.

## Error Categories

### Schema Validation Errors
- **Pattern**: Zod schema validation failures
- **Source**: Runtime type checking across all data models
- **Handling**: Automatic validation on data input/transformation
- **Example**: Vector coordinate validation, graph structure validation
- **Recovery**: Fallback to default values or error state propagation

### File System Errors
- **Pattern**: `error.code !== 'ENOENT'`
- **Source**: /workspace/scripts/clean_fs.ts:17
- **Category**: Infrastructure/build errors
- **Handling**: Specific error code checking for file operations
- **Recovery**: Graceful degradation, skip missing files

### Async Operation Errors
- **Pattern**: `catch((error) => { console.error(...)`
- **Source**: /workspace/apps/legacy-import/cryptic-vault-demo/scripts/verify.ts:68
- **Category**: Network/async failures
- **Handling**: Promise rejection handling with logging
- **Recovery**: User notification, retry mechanisms

### React Component Errors
- **Pattern**: Error boundary implementation
- **Source**: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:24
- **Category**: UI rendering failures
- **Handling**: Component-level error boundaries
- **Recovery**: Fallback UI, error state display

## Logging Patterns

### Debug Logging
- **Pattern**: `console.log`
- **Category**: Development debugging
- **Usage**: General information and state tracking
- **Examples**:
  - Scene initialization: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:103
  - File operations: /workspace/scripts/clean_fs.ts:10
- **Environment**: All environments, verbose in development

### Error Logging
- **Pattern**: `console.error`
- **Category**: Exception and failure tracking
- **Usage**: Error boundaries, exception handlers
- **Examples**:
  - React error boundary: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:24
  - File system errors: /workspace/scripts/clean_fs.ts:18
- **Environment**: All environments, alerts in production

### Conditional Logging
- **Pattern**: `process.env.NODE_ENV === 'development'`
- **Category**: Environment-specific debugging
- **Source**: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:88
- **Usage**: Development-only verbose logging
- **Purpose**: Prevent debug noise in production

## Error Handling Strategies

### Schema Validation Strategy
```typescript
// Zod validation with error handling
try {
  const validatedData = schema.parse(inputData);
  return validatedData;
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation failed:', error.errors);
    throw new Error('Invalid input data format');
  }
}
```

### React Error Boundary Pattern
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
    // Log to monitoring service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Async Error Handling
```typescript
async function fetchData() {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    // Update error state in store
    useAsyncStore().setError(error.message);
    throw error;
  }
}
```

### File System Error Handling
```typescript
try {
  await fs.unlink(filePath);
} catch (error) {
  if (error.code !== 'ENOENT') {
    console.error('File deletion failed:', error);
    throw error;
  }
  // File doesn't exist - continue silently
}
```

## Monitoring & Performance

### Performance Monitoring
- **Pattern**: `performance.now()`
- **Usage**: Timing critical operations (inferred from patterns)
- **Scope**: Graph layout generation, rendering operations
- **Purpose**: Performance optimization, bottleneck identification

### Error Boundaries
- **Implementation**: React error boundaries for component isolation
- **Source**: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:24
- **Scope**: UI component error containment
- **Recovery**: Fallback components, graceful degradation

### Debug Features
- **Flag**: NEXT_PUBLIC_DEBUG_GRAPH
- **Effect**: Enhanced logging for graph operations
- **Usage**: Development debugging, performance analysis
- **Output**: Console logs, timing information

## State Management Error Handling

### Store Error State
- **Pattern**: AsyncSlice error management
- **Properties**: `isLoading`, `error`, `activeJobs`
- **Usage**: Centralized error state across application
- **Recovery**: User notification, retry mechanisms

### Command Queue Error Handling
- **Component**: CommandQueue class
- **Source**: /workspace/packages/store/src/command-queue.ts:7
- **Purpose**: Batch operation error handling
- **Strategy**: Individual command failure isolation

## Best Practices

### Error Message Standards
- Include context about the operation that failed
- Provide actionable information for developers
- Use consistent error formats across packages
- Include relevant data without exposing sensitive information

### Logging Standards
- Use appropriate log levels (info, warn, error)
- Include timestamps and context information
- Avoid logging sensitive data (API keys, user data)
- Use structured logging for better analysis

### Recovery Strategies
- Provide fallback values for non-critical failures
- Implement retry logic for transient errors
- Use error boundaries to contain component failures
- Maintain application stability despite individual failures

## Environment-Specific Behavior

### Development Environment
- Verbose logging enabled
- Detailed error messages
- Stack traces included
- Debug features active

### Production Environment
- Essential logging only
- User-friendly error messages
- Error reporting to monitoring services
- Performance-optimized error handling

### Test Environment
- Mock error conditions
- Controlled error scenarios
- Error handling validation
- Coverage measurement

## Source References
- React error boundary: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:24
- File system errors: /workspace/scripts/clean_fs.ts:17-18
- Async error handling: /workspace/apps/legacy-import/cryptic-vault-demo/scripts/verify.ts:68
- Debug logging examples: /workspace/scripts/clean_fs.ts:10, /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:103
- Environment guards: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:88
- Command queue: /workspace/packages/store/src/command-queue.ts:7

## Open Questions
- [TBD: Centralized error reporting service integration]
- [TBD: Error recovery automation strategies]
- [TBD: Performance impact of extensive error logging]
- [TBD: Error analytics and trend analysis capabilities]