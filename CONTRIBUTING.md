# Contributing to Refinery SDK

Thank you for contributing to Refinery SDK! This guide outlines our development practices and requirements.

## Commit Message Guidelines

We enforce [Conventional Commits](https://www.conventionalcommits.org/) across this repository. All commit messages must follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or modifying tests
- **build**: Changes to build system or dependencies
- **ci**: CI/CD configuration changes
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverting a previous commit

### Examples

```bash
# Good commits
git commit -m "feat(store): add selector support (task 4)"
git commit -m "fix(view-three): resolve canvas rendering issue"
git commit -m "docs: update API documentation"
git commit -m "chore(ci): add commitlint enforcement (task qa-4)"

# Bad commits (will be rejected)
git commit -m "changes"
git commit -m "Fixed bug"
git commit -m "Update store.ts"
```

### Task References

When working on tasks from our backlog, include the task ID in your commit message:

```bash
git commit -m "feat(schema): extract core types (task schema-1)"
```

### Enforcement

- **Local**: Husky pre-commit hook runs commitlint on every commit
- **CI**: Pull requests are validated for commit message compliance

If your commit is rejected, you can amend it:

```bash
git commit --amend -m "proper: commit message format"
```

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes with atomic commits (<200 LOC per commit)
3. Ensure all tests pass: `pnpm test`
4. Run type checks: `pnpm type-check`
5. Run linting: `pnpm lint`
6. Submit a pull request

## Package Manager

This project uses **pnpm**. Never use `npm install` or `yarn`.

```bash
# Install dependencies
pnpm install

# Add a dependency to a specific package
pnpm add <package> --filter <workspace-package>

# Add a dev dependency to the root
pnpm add -D <package> -w
```

## Testing

Write tests for all new features and bug fixes. Aim for ≥80% coverage in new packages.

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```