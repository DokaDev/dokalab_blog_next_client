import { blogPosts, categoryGroups, getCategoryById, getPostsByCategoryId } from '@/app/data/blogData';
import CategorySidebar from '@/app/components/blog/CategorySidebar';
import BlogSearch from '@/app/components/blog/BlogSearch';
import styles from './page.module.scss';
import { Metadata } from 'next';

type PageProps = {
  searchParams: { 
    category?: string;
    tag?: string;
  }
};

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const categoryId = searchParams.category ? parseInt(searchParams.category, 10) : null;
  const tagId = searchParams.tag ? parseInt(searchParams.tag, 10) : null;
  
  // Default title for main blog page
  let title = 'Blog';
  
  // If category is specified, update title to include category name
  if (categoryId !== null) {
    const category = getCategoryById(categoryId);
    if (category) {
      title = `${category.name} - Blog`;
    }
  }

  // If tag is specified, update title to include tag name
  if (tagId !== null) {
    const tag = blogPosts.flatMap(post => post.tags).find(tag => tag.id === tagId);
    if (tag) {
      title = `${tag.name} - Blog`;
    }
  }
  
  return {
    title,
    description: 'Explore our latest articles, tutorials, and updates',
  };
}

export default function BlogPage({ searchParams }: PageProps) {
  // Check if we have a category filter
  const categoryId = searchParams.category ? parseInt(searchParams.category, 10) : null;
  // Check if we have a tag filter
  const tagId = searchParams.tag ? parseInt(searchParams.tag, 10) : null;
  
  let filteredPosts = [...blogPosts];
  let categoryName = 'All Posts';
  
  // Filter posts by category if needed
  if (categoryId !== null) {
    const category = getCategoryById(categoryId);
    if (category) {
      filteredPosts = getPostsByCategoryId(categoryId);
      categoryName = category.name;
    }
  }
  
  // Filter posts by tag if needed
  if (tagId !== null) {
    const tagName = filteredPosts.flatMap(post => post.tags).find(tag => tag.id === tagId)?.name;
    filteredPosts = filteredPosts.filter(post => post.tags.some(tag => tag.id === tagId));
    if (tagName) {
      categoryName = `Tagged with '${tagName}'`;
    }
  }
  
  // Sort posts by date (newest first)
  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <CategorySidebar 
            categoryGroups={categoryGroups} 
            selectedCategoryId={categoryId} 
          />
        </div>
        
        <div className={styles.posts}>
          <BlogSearch 
            posts={sortedPosts} 
            categoryName={categoryName} 
          />
        </div>
      </div>
    </div>
  );
}

