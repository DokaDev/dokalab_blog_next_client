/**
 * PostRenderer Component
 * Main component for rendering blog post content
 * Orchestrates the rendering of post header, content, and navigation
 */

'use client';

import { BlogPost, BlogPostNoAuthor, Category } from '@/app/types/blog';
import MarkdownRenderer from '@/app/components/markdown/MarkdownRenderer';
import PostBreadcrumb from './PostBreadcrumb';
import PostHeader from './PostHeader';
import PostNavigation from './PostNavigation';
import styles from './PostRenderer.module.scss';

interface PostRendererProps {
  post: BlogPost | BlogPostNoAuthor;
  category?: Category | null;
  adjacentPosts?: {
    previous?: BlogPost | BlogPostNoAuthor | null;
    next?: BlogPost | BlogPostNoAuthor | null;
  };
  showAuthor?: boolean;
}

export default function PostRenderer({
  post,
  category,
  adjacentPosts,
  showAuthor = false
}: PostRendererProps) {
  // Use actual content from post or generate sample content for demo
  const content = post.content || generateSampleContent();

  return (
    <article className={styles.postRenderer}>
      {/* Breadcrumb Navigation */}
      <PostBreadcrumb 
        postTitle={post.title}
        category={category}
      />

      {/* Post Header with metadata */}
      <PostHeader
        post={post}
        category={category}
        showAuthor={showAuthor}
      />

      {/* Main Article Content */}
      <section className={styles.articleContent}>
        <MarkdownRenderer content={content} />
      </section>

      {/* Previous/Next Post Navigation */}
      {adjacentPosts && (
        <PostNavigation
          previous={adjacentPosts.previous}
          next={adjacentPosts.next}
        />
      )}
    </article>
  );
}

// Sample content generator for demo purposes
function generateSampleContent(): string {
  return `## Introduction

This is a comprehensive guide that covers the essential concepts and practical applications. Whether you're a beginner or an experienced developer, this article will provide valuable insights and actionable knowledge.

## Key Concepts

### Understanding the Fundamentals

The foundation of any successful implementation lies in understanding the core principles. Let's explore the key concepts that will guide our approach:

- **Concept 1**: Essential building blocks that form the foundation
- **Concept 2**: Advanced techniques for optimization
- **Concept 3**: Best practices for maintainable code

### Practical Implementation

Here's how you can apply these concepts in real-world scenarios:

\`\`\`javascript
// Example implementation
function exampleFunction() {
  console.log("This is a sample code block");
  return "Hello, World!";
}

// Usage
const result = exampleFunction();
console.log(result);
\`\`\`

## Advanced Techniques

:::tip
This is a helpful tip that provides additional context and guidance for better understanding.
:::

:::warning
Be careful when implementing these techniques in production environments. Always test thoroughly.
:::

### Performance Considerations

When working with these technologies, consider the following performance optimizations:

1. **Optimization Strategy 1**: Detailed explanation of the first strategy
2. **Optimization Strategy 2**: How to implement the second approach
3. **Optimization Strategy 3**: Advanced techniques for maximum efficiency

## Mathematical Concepts

Sometimes we need to express complex relationships using mathematical notation:

The fundamental equation can be expressed as: $E = mc^2$

For more complex calculations:

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

## Conclusion

This comprehensive overview provides the foundation you need to get started. Remember to practice these concepts and experiment with different approaches to find what works best for your specific use case.

### Next Steps

- [ ] Practice the basic concepts
- [ ] Implement a simple project
- [ ] Explore advanced features
- [ ] Share your learnings with the community

## Additional Resources

For further reading and deeper understanding, check out these resources:

- [Official Documentation](https://example.com)
- [Community Forum](https://example.com)
- [Advanced Tutorials](https://example.com)

---

*Thank you for reading! If you found this article helpful, please share it with others who might benefit from this knowledge.*`;
} 