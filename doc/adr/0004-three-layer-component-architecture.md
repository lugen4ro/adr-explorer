# 4. Three-Layer Component Architecture

Date: 2025-09-26

## Status

Accepted

## Context

We need to establish a component design system that provides clear organization and reusability without the complexity overhead of full Atomic Design methodology. The team found the traditional five-layer approach (atoms, molecules, organisms, templates, pages) to be overly complex for our needs, particularly the organisms and pages layers which created ambiguity and maintenance burden.

We need a system that:

- Maintains clear separation between reusable and context-specific components
- Provides predictable dependency management
- Scales with team growth and application complexity
- Reduces architectural decision fatigue

## Decision

We will implement a three-layer component architecture:

1. **Atoms**: Basic, single-purpose UI elements (buttons, labels, images, input fields, icons)
2. **Molecules**: Reusable combinations of atoms that remain context-agnostic (form inputs with labels, search bars, button groups)
3. **Composites**: Context-aware components built for specific business use cases (product cards, user profile headers, dashboard widgets)

### Key Constraints:

- **Molecules can only compose atoms** - no molecule-to-molecule dependencies to maintain predictable dependency trees
- **Composites encode business logic** - they understand domain context and specific data structures
- **Atoms and molecules must remain general-purpose** - no business logic or context-specific behavior

### Directory Structure:

```
components/
├── atoms/           # Flat directory of basic elements
├── molecules/       # Flat directory of reusable patterns
└── composites/      # Organized by business domain
    ├── product/
    ├── user/
    ├── commerce/
    ├── dashboard/
    └── shared/      # Multi-context composites
```

## Consequences

### Positive:

- **Simplified mental model** - three clear layers vs. five ambiguous ones
- **Predictable dependencies** - flat dependency trees make debugging and testing easier
- **Clear boundaries** - obvious distinction between general-purpose and context-specific components
- **Maintainable** - business logic changes are isolated to composites
- **Scalable** - domain-based composite organization grows naturally with the application

### Negative:

- **Potential duplication** - some atom combinations may be repeated across molecules
- **Less flexibility** - cannot compose molecules from other molecules (by design)
- **Learning curve** - team needs to understand when to create composites vs. extending molecules

### Risks:

- **Composite creep** - tendency to create composites when molecules would suffice
- **Domain boundaries** - may need to refactor composite organization as business domains evolve

### Mitigations:

- Establish clear guidelines for atom vs. molecule vs. composite decisions
- Regular architecture reviews to prevent boundary violations
- Document examples of each layer to guide future development
