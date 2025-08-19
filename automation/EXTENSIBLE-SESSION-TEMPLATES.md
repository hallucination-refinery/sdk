# Extensible Session Templates Library

**Created:** 2025-08-19  
**Purpose:** Reusable 30-45 minute session templates for any domain  
**Pattern:** Goal → Steps → Verification → Error Recovery → Meta-Audit

## Core Session Types

### 1. DISCOVERY Session Template

**Duration:** 30-45 minutes  
**Agent Type:** `discovery-agent`  
**Parallelizable:** Yes

```yaml
template: DISCOVERY
parameters:
  target: "[WHAT TO DISCOVER]"  # e.g., "codebase structure", "data sources"
  scope: "[BOUNDARIES]"          # e.g., "packages/", "*.config files"
  depth: "[DETAIL LEVEL]"        # e.g., "high-level", "comprehensive"

goal: |
  Discover and catalog {target} within {scope} at {depth} level

steps:
  - Search for relevant files/patterns
  - Analyze structure and relationships
  - Document findings in structured format
  - Identify gaps and unknowns
  - Create catalog/inventory

verification:
  - Coverage: >80% of {scope} examined
  - Documentation: Structured output created
  - Gaps: Explicitly listed

error_recovery:
  - If search fails: Broaden patterns
  - If too much data: Increase abstraction level
  - If unclear structure: Create hypothesis and test

meta_audit:
  - Time taken vs. allocated
  - Completeness of discovery
  - Quality of documentation
  - Identified follow-up tasks
```

### 2. IMPLEMENTATION Session Template

**Duration:** 45 minutes  
**Agent Type:** `synthesis-agent`  
**Parallelizable:** Depends on dependencies

```yaml
template: IMPLEMENTATION
parameters:
  component: "[WHAT TO BUILD]"     # e.g., "auth module", "data parser"
  specification: "[REQUIREMENTS]"   # e.g., "must handle 1000 req/s"
  constraints: "[LIMITATIONS]"      # e.g., "no external dependencies"

goal: |
  Implement {component} according to {specification} within {constraints}

steps:
  - Review specification and constraints
  - Design solution approach
  - Implement core functionality
  - Add error handling
  - Create basic tests

verification:
  - Functionality: Meets specification
  - Quality: No linting errors
  - Tests: At least one passing test
  - Documentation: Inline comments added

error_recovery:
  - If spec unclear: Implement minimal viable version
  - If time pressure: Focus on core path only
  - If complex: Break into smaller components

meta_audit:
  - Specification compliance
  - Code quality metrics
  - Test coverage
  - Technical debt incurred
```

### 3. VALIDATION Session Template

**Duration:** 30 minutes  
**Agent Type:** `audit-agent`  
**Parallelizable:** Yes

```yaml
template: VALIDATION
parameters:
  target: "[WHAT TO VALIDATE]"      # e.g., "API endpoints", "data pipeline"
  criteria: "[ACCEPTANCE CRITERIA]" # e.g., "response time <100ms"
  method: "[VALIDATION APPROACH]"   # e.g., "automated tests", "manual review"

goal: |
  Validate {target} against {criteria} using {method}

steps:
  - Load/access target
  - Apply validation method
  - Record results
  - Compare against criteria
  - Document failures

verification:
  - Coverage: All criteria checked
  - Results: Clear pass/fail for each
  - Evidence: Metrics/logs captured

error_recovery:
  - If target unavailable: Use mock/stub
  - If criteria ambiguous: Test boundary cases
  - If method fails: Try alternative approach

meta_audit:
  - Validation thoroughness
  - False positive/negative rate
  - Time to validate
  - Actionable findings
```

### 4. INTEGRATION Session Template

**Duration:** 45 minutes  
**Agent Type:** `synthesis-agent`  
**Parallelizable:** No (usually sequential)

```yaml
template: INTEGRATION
parameters:
  components: "[WHAT TO INTEGRATE]" # e.g., "modules A, B, C"
  interface: "[HOW THEY CONNECT]"   # e.g., "REST API", "event bus"
  validation: "[SUCCESS CRITERIA]"  # e.g., "data flows correctly"

goal: |
  Integrate {components} via {interface} and verify {validation}

steps:
  - Review component interfaces
  - Create integration code
  - Wire up connections
  - Test data flow
  - Handle edge cases

verification:
  - Connectivity: All components connected
  - Data flow: Information passes correctly
  - Error handling: Failures managed gracefully

error_recovery:
  - If interface mismatch: Create adapter
  - If data corruption: Add validation layer
  - If performance issues: Add caching/queuing

meta_audit:
  - Integration complexity
  - Coupling level
  - Performance impact
  - Maintenance burden
```

### 5. OPTIMIZATION Session Template

**Duration:** 45 minutes  
**Agent Type:** `synthesis-agent`  
**Parallelizable:** Yes

```yaml
template: OPTIMIZATION
parameters:
  target: "[WHAT TO OPTIMIZE]"      # e.g., "render loop", "database queries"
  metric: "[WHAT TO IMPROVE]"       # e.g., "fps", "response time"
  goal_value: "[TARGET METRIC]"     # e.g., "60fps", "<100ms"

goal: |
  Optimize {target} to achieve {goal_value} for {metric}

steps:
  - Profile current performance
  - Identify bottlenecks
  - Implement optimizations
  - Measure improvements
  - Document changes

verification:
  - Baseline: Original metric captured
  - Improvement: New metric measured
  - Target: Goal value achieved or progress made

error_recovery:
  - If no bottleneck found: Broaden profiling
  - If optimization fails: Try alternative approach
  - If regression: Revert and reassess

meta_audit:
  - Actual vs expected improvement
  - Code complexity impact
  - Maintainability trade-offs
  - Further optimization potential
```

### 6. DOCUMENTATION Session Template

**Duration:** 30 minutes  
**Agent Type:** `synthesis-agent`  
**Parallelizable:** Yes

```yaml
template: DOCUMENTATION
parameters:
  subject: "[WHAT TO DOCUMENT]"     # e.g., "API", "architecture"
  audience: "[WHO WILL READ]"       # e.g., "developers", "users"
  format: "[OUTPUT FORMAT]"         # e.g., "markdown", "JSDoc"

goal: |
  Document {subject} for {audience} in {format}

steps:
  - Analyze subject matter
  - Structure documentation
  - Write core content
  - Add examples
  - Review for clarity

verification:
  - Completeness: All aspects covered
  - Clarity: Appropriate for audience
  - Examples: At least one per concept

error_recovery:
  - If subject unclear: Document what's known
  - If too complex: Break into sections
  - If time limited: Focus on critical paths

meta_audit:
  - Documentation coverage
  - Clarity score
  - Example quality
  - Maintenance needs
```

## Using These Templates

### Step 1: Choose Template
Select the appropriate template based on task type

### Step 2: Fill Parameters
```yaml
template: DISCOVERY
parameters:
  target: "GraphQL API endpoints"
  scope: "src/api/"
  depth: "comprehensive"
```

### Step 3: Execute with Claude Code
```
"Execute a DISCOVERY session with these parameters:
- Target: GraphQL API endpoints
- Scope: src/api/
- Depth: comprehensive
Follow the session template from EXTENSIBLE-SESSION-TEMPLATES.md"
```

### Step 4: Chain Sessions
```yaml
workflow:
  - session_1:
      template: DISCOVERY
      parameters: {...}
  - session_2:
      template: IMPLEMENTATION
      parameters: {...}
      depends_on: session_1
  - session_3:
      template: VALIDATION
      parameters: {...}
      depends_on: session_2
```

## Customizing Templates

### Adding Domain-Specific Steps
```yaml
template: DISCOVERY_CUSTOM
extends: DISCOVERY
additional_steps:
  - "Check compliance requirements"
  - "Verify security policies"
```

### Adjusting Time Allocations
```yaml
template: QUICK_VALIDATION
extends: VALIDATION
duration: 15 minutes
reduced_steps:
  - "Spot check critical paths only"
  - "Document risks of partial validation"
```

### Creating New Templates
```yaml
template: YOUR_CUSTOM_TYPE
duration: 30-45 minutes
agent_type: appropriate-agent
parallelizable: true/false

goal: |
  Clear, measurable objective

steps:
  - Specific, actionable steps
  - Time-boxed activities
  
verification:
  - Measurable success criteria
  
error_recovery:
  - Fallback strategies
  
meta_audit:
  - Reflection points
```

## Best Practices

1. **Keep sessions atomic:** Each should produce a clear deliverable
2. **Time-box strictly:** Don't exceed 45 minutes
3. **Document assumptions:** Make implicit knowledge explicit
4. **Capture metrics:** Enable continuous improvement
5. **Chain thoughtfully:** Consider dependencies and parallelization

## Template Evolution

These templates improve through use:
1. Track session outcomes
2. Identify patterns in failures
3. Refine steps and verifications
4. Share improvements back to this document

**Remember:** Templates are guides, not rigid rules. Adapt based on context while maintaining the core structure.