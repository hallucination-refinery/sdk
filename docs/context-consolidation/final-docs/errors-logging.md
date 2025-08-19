# Error Handling & Logging Documentation

## Overview

The Refinery SDK employs a multi-layered error handling and logging strategy designed for development debugging and production monitoring. The system combines runtime validation through Zod schemas, React error boundaries, and environment-specific logging patterns.

## Error Categories [Verified]

### Schema Validation Errors
- **Pattern**: Zod schema validation failures for RawMemorySchema, ForgeOptionsSchema, IntentEnum
- **Source**: Runtime type checking across all data models in /workspace/packages/schema/
- **Handling**: Automatic validation on data input/transformation
- **Example**: RawMemorySchema field validation, IntentEnum value validation
- **Recovery**: Fallback to default values or error state propagation
- **Cross-reference**: Schema definitions → see data-models.md

### File System Errors [Verified]
- **Pattern**: `throw new Error`, `error.code !== 'ENOENT'`
- **Source**: /workspace/scripts/clean_fs.ts, /workspace/packages/store/src/persistence.ts [High Confidence]
- **Category**: Infrastructure/build errors, localStorage operations
- **Handling**: Specific error code checking for file operations
- **Recovery**: Graceful degradation, skip missing files
- **Context**: File parsing and localStorage operations

### Async Operation Errors [Verified]
- **Pattern**: `console.error`, async operation error handling
- **Source**: /workspace/packages/store/src/persistence.ts, /workspace/apps/legacy-import/cryptic-vault-demo/scripts/verify.ts [High Confidence]
- **Category**: Network/async failures, localStorage save/load operations
- **Handling**: Promise rejection handling with logging
- **Recovery**: User notification, retry mechanisms via AsyncSlice
- **Cross-reference**: AsyncSlice error state → see apis.md

### React Component Errors [Verified]
- **Pattern**: Error boundary implementation, `process.env.NODE_ENV !== 'production'` checks
- **Source**: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx, /workspace/packages/canvas-r3f/src/adapters/ForgeGraphAdapter.tsx [High Confidence]
- **Category**: UI rendering failures, development mode checks
- **Handling**: Component-level error boundaries, development vs production environment checks
- **Recovery**: Fallback UI, error state display, debug logging in development

## Logging Patterns

### Debug Logging [Verified]
- **Pattern**: `console.log`, NEXT_PUBLIC_DEBUG_GRAPH flag usage
- **Category**: Development debugging
- **Usage**: General information and state tracking
- **Examples**:
  - Scene initialization: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx [High Confidence]
  - File operations: /workspace/scripts/clean_fs.ts [High Confidence]
  - Graph debug logging via environment flag
- **Environment**: All environments, verbose in development
- **Cross-reference**: Debug configuration → see configuration.md

### Error Logging [Verified]
- **Pattern**: `console.error`
- **Category**: Exception and failure tracking
- **Usage**: Error boundaries, exception handlers, persistence operations
- **Examples**:
  - React error boundary: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx [High Confidence]
  - File system errors: /workspace/scripts/clean_fs.ts [High Confidence]
  - localStorage save/load errors: /workspace/packages/store/src/persistence.ts [High Confidence]
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

## Source References [Verified]
- React error boundary: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx [High Confidence]
- File system errors: /workspace/scripts/clean_fs.ts [High Confidence]
- Persistence errors: /workspace/packages/store/src/persistence.ts [High Confidence]
- ForgeGraph adapter errors: /workspace/packages/canvas-r3f/src/adapters/ForgeGraphAdapter.tsx [High Confidence]
- Command queue: /workspace/packages/store/src/command-queue.ts [High Confidence]
- Environment guards: Development vs production checks in components [Medium Confidence]
- Logging libraries: console (built-in) [High Confidence]

## Open Questions
- [TBD: Centralized error reporting service integration]
- [TBD: Error recovery automation strategies]
- [TBD: Performance impact of extensive error logging]
- [TBD: Error analytics and trend analysis capabilities]