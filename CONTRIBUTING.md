# Contributing to DokaLab Blog

Thank you for your interest in contributing to the DokaLab Blog project! This document provides comprehensive guidelines to help you contribute effectively to our Next.js-based blog platform.

## Table of Contents

- [Contributing to DokaLab Blog](#contributing-to-dokalab-blog)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
    - [Key Technologies](#key-technologies)
  - [Getting Started](#getting-started)
  - [Project Structure](#project-structure)
    - [Key Conventions to Follow](#key-conventions-to-follow)
  - [Code Conventions](#code-conventions)
    - [TypeScript](#typescript)
    - [React Components](#react-components)
    - [Styling](#styling)
  - [Development Workflow](#development-workflow)
  - [Commit Guidelines](#commit-guidelines)
    - [Commit Message Format](#commit-message-format)
    - [Types](#types)
    - [Examples](#examples)
  - [Pull Request Process](#pull-request-process)
    - [Example PR Description](#example-pr-description)
  - [Dependency Management](#dependency-management)
    - [Adding or Updating Dependencies](#adding-or-updating-dependencies)
    - [Example Dependency Issue Description](#example-dependency-issue-description)
  - [Issue Labels](#issue-labels)
  - [Final Notes](#final-notes)

## Project Overview

DokaLab Blog is a personal tech blog built with Next.js, focusing on topics like web development, AI, and systems design. The project follows a microservice architecture, with this repository containing the frontend client application.

### Key Technologies

- **Next.js 15.2.3** with the App Router pattern
- **React 19.0.0** for UI components
- **TypeScript** for type safety
- **SCSS Modules** for component-scoped styling
- **React Markdown** with KaTeX for rich content rendering
- **Docker** for containerization

## Getting Started

1. **Fork the repository** to your GitHub account
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/dokalab_blog_next_client.git
   cd dokalab_blog_next_client
   ```
3. **Install dependencies**:
   ```bash
   npm ci
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

The project follows a specific directory structure that should be maintained for consistency:

```
app/
  ├── (auth)/            # Authentication-related routes
  ├── (blog)/            # Blog-related routes
  │   ├── page.tsx       # Blog main page
  │   ├── [category]/    # Category pages
  │   └── [slug]/        # Individual post pages
  ├── components/        # Reusable components
  │   ├── common/        # Common UI components
  │   ├── layout/        # Layout-related components (Header, Footer, Navigation)
  │   ├── markdown/      # Markdown rendering components
  ├── lib/               # Utility functions, custom hooks, API clients
  ├── globals.css        # Global styles
  └── page.tsx           # Home page
```

### Key Conventions to Follow

1. **Page Components**: Place in route directories (e.g., `app/blog/page.tsx`)
2. **Component Structure**:
   - One component per file
   - Name files using PascalCase (e.g., `MarkdownRenderer.tsx`)
   - Pair each component with its SCSS module (e.g., `MarkdownRenderer.module.scss`)

3. **Client vs. Server Components**:
   - Server components are the default
   - Use `'use client'` directive only when necessary (event handlers, hooks)

4. **CSS Structure**:
   - Use SCSS modules for component-specific styles
   - Global styles in `globals.css`
   - Use BEM-like naming conventions in class names

## Code Conventions

### TypeScript

- Always define proper interfaces/types for component props
- Use TypeScript's strict mode features
- Avoid `any` type when possible; use proper type definitions

```typescript
// Example component with proper TypeScript typing
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={styles[variant]} 
      onClick={onClick}
    >
      {text}
    </button>
  );
};
```

### React Components

- Create functional components using arrow functions
- Use React hooks appropriately
- Include comprehensive JSDoc comments for complex components

```typescript
/**
 * Renders a markdown content block with syntax highlighting and LaTeX support
 * @param content - The markdown content to render
 * @param className - Optional class name for additional styling
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Component implementation
};
```

### Styling

- Use SCSS modules for component-specific styles
- Define media queries using mobile-first approach
- Use variables for colors, spacing, and typography

```scss
// Example SCSS module pattern
.container {
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
}

.title {
  font-size: 1.5rem;
  color: #333;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
}
```

## Development Workflow

1. **Create an issue** describing the feature/bug/improvement before starting work
2. **Wait for issue assignment** from a maintainer before proceeding
3. **Create a feature branch** from the main branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our code conventions
5. **Test your changes** thoroughly
6. **Commit your changes** using the conventional commit format
7. **Push to your fork**
8. **Create a Pull Request** against the main repository

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for creating an explicit commit history.

### Commit Message Format

```
<type>(<scope>): <short summary>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

### Examples

```
feat(blog): add comment section to blog posts

Implement a new comment section at the bottom of each blog post.
The feature includes:
- Comment submission form
- Comment listing
- Reply functionality
- Markdown support in comments

Closes #123
```

```
fix(markdown): correct LaTeX rendering in inline code blocks

LaTeX expressions were not rendering correctly when placed inside
inline code blocks due to incorrect regex pattern in the preprocessor.

This commit fixes the regex pattern to properly detect and handle
LaTeX expressions in inline code contexts.

Fixes #456
```

## Pull Request Process

1. **Link to the related issue** using GitHub's linking feature
2. **Provide a clear description** of the changes you've made
3. **Include screenshots or GIFs** for UI changes
4. **Ensure all tests pass** and the build is successful
5. **Request a review** from at least one maintainer
6. **Address any feedback** from code reviews
7. **Wait for approval** before merging

### Example PR Description

```markdown
# PR: Add Comment Section to Blog Posts

## Related Issue
Closes #123

## Description
This PR adds a new comment section at the bottom of each blog post.

Features implemented:
- Comment submission form with validation
- Comment listing with pagination
- Reply functionality with threading
- Markdown support in comments
- Real-time updates for new comments

## Screenshots
![Comment Section Screenshot](link-to-screenshot.png)

## Testing Done
- Tested commenting as a logged-in user
- Tested error states in the comment form
- Verified markdown rendering in comments
- Checked responsive layout on mobile devices

## Additional Notes
The backend API endpoint for this feature was added in PR #122.
```

## Dependency Management

Dependencies are a critical aspect of the project. Changes to dependencies can have significant implications for the entire application.

### Adding or Updating Dependencies

1. **NEVER bundle dependency changes with feature/fix PRs**
2. **Create a separate issue** specifically for the dependency change
   - Use the `dependencies` label
   - Explain why the dependency is needed or needs updating
   - Detail potential impacts on the project
   - Analyze alternatives if applicable

3. **After discussion and approval**, create a separate PR for the dependency change

### Example Dependency Issue Description

```markdown
# Issue: Add React Query for API Data Fetching

## Dependency Details
- Package: `@tanstack/react-query`
- Version: `5.8.4`
- Purpose: Improve API data fetching, caching, and state management

## Justification
Currently, our application uses custom fetch wrappers without proper
caching or loading state management. React Query would provide:
- Automatic caching
- Loading/error states
- Refetching strategies
- Data synchronization

## Impact Analysis
- Bundle size: Increase of ~12KB (gzipped)
- Performance: Expected improvement in perceived performance due to caching
- Breaking changes: None, as this would be implemented alongside existing fetch logic

## Alternatives Considered
- SWR: Similar features but less comprehensive
- Apollo Client: Too heavy for our needs when we don't use GraphQL
- Custom solution: Would require significant development time
```

## Issue Labels

We use specific labels to categorize issues:

- **enhancement**: For new features or improvements to existing functionality
- **bug**: For bugs or incorrect behavior in the application
- **question**: For questions or clarifications about the project
- **dependencies**: For issues related to dependency changes
- **documentation**: For improvements or additions to documentation

## Final Notes

By following these guidelines, you help maintain the quality and consistency of the DokaLab Blog project. We appreciate your contributions and look forward to collaborating with you!

If you have any questions not covered by this guide, please open an issue with the `question` label. 