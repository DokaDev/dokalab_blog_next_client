import MarkdownRenderer from '@/app/components/markdown/MarkdownRenderer';
import { generateStaticPageMetadata } from '@/lib/metadata/generator';
import styles from './page.module.scss';

export const metadata = generateStaticPageMetadata(
  'About',
  'Learn about DokaLab and the passion behind this technology blog. Discover my mission to share knowledge and build a community of curious learners.',
  '/about'
);

export default function AboutPage() {
  const aboutContent = `# Hello

## Let me introduce myself

Welcome to DokaLab! I'm passionate about technology and love sharing knowledge through this personal blog.

### What I Do

I'm a full-stack developer with interests in:
- **Web Development**: Building modern, responsive applications
- **AI & Machine Learning**: Exploring the latest developments in artificial intelligence
- **System Architecture**: Designing scalable and efficient systems

### Why DokaLab?

The name "DokaLab" combines "Documentation" and "Laboratory" - representing my commitment to documenting knowledge while experimenting with new technologies and ideas.

### My Mission

Through this blog, I aim to:
1. Share practical insights and tutorials
2. Break down complex technical concepts into digestible content
3. Build a community of curious learners and practitioners

### Let's Connect

Feel free to reach out if you have questions, suggestions, or just want to chat about technology!

---

*Thank you for visiting DokaLab. I hope you find the content valuable and inspiring.*`;

  return (
    <div className={styles.container}>
      <MarkdownRenderer content={aboutContent} />
    </div>
  );
}