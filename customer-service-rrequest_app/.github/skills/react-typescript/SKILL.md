---
name: react-typescript
description: "Use when: building, debugging, refactoring, or reviewing React applications in JavaScript or TypeScript, especially Vite or modern frontend projects."
---

# React + TypeScript Workflow

## Purpose

Use this skill to plan, implement, and verify React features in a structured way when working with JavaScript or TypeScript. It is especially useful for Vite-based applications, component-driven UIs, state management, routing, API integration, and refactoring.

## When to Use

Use this skill when you need to:
- create or update React components
- add or improve TypeScript typing
- refactor existing UI logic into reusable hooks or services
- debug rendering, state, or data-fetching issues
- add tests, validation, or build fixes
- review a React codebase for maintainability and correctness

## Core Workflow

1. Understand the goal
   - Clarify the user-facing outcome, affected screens, and expected behavior.
   - Identify whether the task is a feature, bug fix, refactor, or performance improvement.

2. Inspect the existing structure
   - Review the relevant component, page, hook, service, and style files.
   - Follow the project’s existing patterns for state, routing, API calls, and naming.
   - Prefer reusing existing components and utilities before introducing new ones.

3. Choose the right implementation approach
   - Use local state for simple, component-scoped behavior.
   - Use context or a store for shared state across multiple components.
   - Use custom hooks for reusable logic and service modules for API communication.
   - Prefer TypeScript for new code; convert existing JavaScript files when the change is safe and straightforward.

4. Implement with maintainability in mind
   - Keep components focused and small.
   - Use descriptive names and clear prop interfaces.
   - Handle loading, error, and empty states explicitly.
   - Keep business logic separate from presentation where appropriate.

5. Validate before finishing
   - Run the relevant build, lint, or test commands.
   - Check for TypeScript errors, runtime issues, and accessibility concerns.
   - Confirm the feature behaves correctly in the intended user flow.

## Decision Points

- JavaScript vs TypeScript
  - If the project already uses TypeScript, prefer TypeScript for all new work.
  - If the task is in a JavaScript file, consider converting it to TypeScript if it improves safety and consistency.

- State management
  - Use local state for component-level logic.
  - Use context or a store when state must be shared across the app.

- Data fetching
  - Keep API calls in a service layer or custom hook.
  - Handle asynchronous loading and errors consistently.

- Styling
  - Follow the existing styling system in the project.
  - Avoid introducing conflicting patterns unless the project already supports them.

## Completion Checklist

A task is complete when:
- the implementation matches the requested behavior
- the code follows the project’s conventions
- TypeScript or lint issues are resolved
- relevant tests or build checks pass
- the change does not introduce regressions

## Example Prompts

- "Create a reusable React component for a customer form with TypeScript props."
- "Refactor this page to use a custom hook and improve typing."
- "Fix the state bug in this React component and verify the build."
- "Add validation and error handling for this API-driven form."
