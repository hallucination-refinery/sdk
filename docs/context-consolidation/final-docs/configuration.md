# Configuration Documentation

## Overview

The Refinery SDK uses a multi-layered configuration system combining environment variables, JSON/YAML configuration files, and runtime defaults. The system supports development and production environments with appropriate overrides and feature flags for debugging and customization.

## Environment Variables

### Required API Keys

#### ANTHROPIC_API_KEY
- **Type**: string  
- **Default**: "your_anthropic_api_key_here"
- **Source**: /workspace/.env:2
- **Description**: Required API key for Anthropic services
- **Usage**: LLM integration, content generation features
- **Required**: Yes (production), placeholder acceptable (development)

#### ELEVEN_LABS_API_KEY
- **Type**: string
- **Default**: "your_eleven_labs_api_key_here" 
- **Source**: /workspace/.env:13
- **Description**: Required for voice synthesis features
- **Usage**: Text-to-speech, voice interaction capabilities
- **Required**: Optional (only if voice features enabled)

### Application Configuration

#### NEXT_PUBLIC_GRAPH_SPAWN
- **Type**: string
- **Default**: "origin"
- **Source**: /workspace/.env:16
- **Description**: Graph spawn animation mode
- **Values**: "sphere" | "origin"
- **Usage**: Controls how new nodes appear in 3D space
- **Impact**: Visual effect only, no functional changes

#### NEXT_PUBLIC_DEBUG_GRAPH
- **Type**: boolean
- **Default**: "false"
- **Source**: /workspace/.env:17
- **Description**: Enable graph debug logging
- **Usage**: Development debugging, performance analysis
- **Impact**: Console logging verbosity, performance data collection

#### NODE_ENV
- **Type**: string
- **Default**: "development"
- **Source**: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:88
- **Description**: Node.js environment mode
- **Values**: "development" | "production" | "test"
- **Usage**: Environment-specific behavior, logging levels

## Configuration Files

### Build & Orchestration

#### turbo.json
- **Type**: JSON configuration
- **Path**: /workspace/turbo.json
- **Purpose**: Turbo monorepo task configuration
- **Content**: Task definitions, caching rules, dependency graphs
- **Scope**: Build system, CI/CD pipeline optimization

#### pnpm-workspace.yaml
- **Type**: YAML configuration
- **Path**: /workspace/pnpm-workspace.yaml
- **Purpose**: PNPM workspace configuration
- **Content**: Package patterns, workspace dependencies
- **Scope**: Package management, dependency resolution

### TypeScript Configuration [Verified]

#### tsconfig.base.json
- **Type**: JSON configuration
- **Path**: /workspace/tsconfig.base.json [High Confidence]
- **Purpose**: Base TypeScript configuration for all packages
- **Content**: Compiler options, path mappings, module resolution  
- **Scope**: Type checking, compilation settings across monorepo
- **Cross-reference**: Enables type safety for schemas → see data-models.md

### Development Tools

#### vitest.config.ts
- **Type**: TypeScript configuration
- **Path**: /workspace/vitest.config.ts
- **Purpose**: Root test configuration
- **Content**: Test runner settings, coverage rules, environment setup
- **Scope**: Unit testing, integration testing across packages

#### eslint.config.js
- **Type**: JavaScript configuration
- **Path**: /workspace/eslint.config.js
- **Purpose**: ESLint linting configuration
- **Content**: Linting rules, parser settings, plugin configurations
- **Scope**: Code quality, style enforcement across codebase

## Version Requirements & Defaults

### Runtime Dependencies

#### Node.js Version
- **Requirement**: >=20.0.0
- **Source**: /workspace/package.json:8
- **Purpose**: Minimum Node.js version for all applications
- **Rationale**: Modern JavaScript features, performance optimizations

#### PNPM Version
- **Requirement**: >=9.0.0
- **Source**: /workspace/package.json:9
- **Purpose**: Minimum PNPM version for workspace support
- **Rationale**: Workspace features, dependency management improvements

#### React Version
- **Version**: 19.1.0 (pinned)
- **Source**: /workspace/package.json:48
- **Purpose**: UI framework version consistency
- **Rationale**: Avoid compatibility issues, stable feature set

#### Three.js Version
- **Version**: 0.176.0 (pinned)
- **Source**: /workspace/package.json:47
- **Purpose**: 3D graphics library version consistency
- **Rationale**: API stability, rendering compatibility

## Configuration Precedence

### Override Hierarchy (highest to lowest)
1. **Runtime Environment Variables** - Process environment overrides
2. **Local .env Files** - Development-specific overrides
3. **Package Configuration** - Package-specific settings
4. **Global Configuration** - Monorepo-wide defaults
5. **Built-in Defaults** - Hardcoded fallback values

### Environment-Specific Loading
- **Development**: Loads .env files, enables debug features
- **Production**: Environment variables only, optimized builds
- **Test**: Isolated configuration, mock API keys

## Feature Flags & Debug Options

### Debug Features

#### Graph Debug Logging
- **Variable**: NEXT_PUBLIC_DEBUG_GRAPH
- **Effect**: Enables verbose graph operation logging
- **Usage**: Performance analysis, layout debugging
- **Location**: Console output, browser developer tools

#### Development Guards
- **Condition**: process.env.NODE_ENV === 'development'
- **Source**: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx:88
- **Effect**: Development-only logging and debugging features
- **Purpose**: Prevent debug code from running in production

### Visual Customization

#### Graph Spawn Animation
- **Variable**: NEXT_PUBLIC_GRAPH_SPAWN
- **Options**: 
  - "sphere": Nodes spawn from spherical distribution
  - "origin": Nodes spawn from central origin point
- **Impact**: Visual appearance only, no performance difference

## Configuration Loading Patterns

### Environment Variable Access
```typescript
// Standard Next.js pattern for public variables
const spawnMode = process.env.NEXT_PUBLIC_GRAPH_SPAWN || 'origin';

// Server-side only variables
const apiKey = process.env.ANTHROPIC_API_KEY;
```

### Development vs Production
```typescript
// Conditional behavior based on environment
if (process.env.NODE_ENV === 'development') {
  console.log('Debug information');
}
```

### Default Value Patterns
```typescript
// Fallback to sensible defaults
const debugEnabled = process.env.NEXT_PUBLIC_DEBUG_GRAPH === 'true';
const spawnMode = process.env.NEXT_PUBLIC_GRAPH_SPAWN || 'origin';
```

## Security Considerations

### API Key Management
- Store sensitive keys in environment variables only
- Never commit API keys to version control
- Use placeholder values in .env examples
- Implement key validation in application startup

### Public vs Private Variables
- NEXT_PUBLIC_* variables exposed to browser
- Regular environment variables server-side only
- Sensitive configuration must not use NEXT_PUBLIC_ prefix

## Source References [Verified]
- Environment variables: /workspace/.env [High Confidence]
- Package requirements: /workspace/package.json [High Confidence]
- Build configuration: /workspace/turbo.json [High Confidence]
- TypeScript config: /workspace/tsconfig.base.json [High Confidence]
- Workspace config: /workspace/pnpm-workspace.yaml [High Confidence]
- Package lock: /workspace/pnpm-lock.yaml [High Confidence]
- Environment usage in components: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx [Medium Confidence]

## Open Questions
- [TBD: Runtime configuration validation and error handling]
- [TBD: Configuration hot-reloading during development]
- [TBD: Production deployment configuration management]