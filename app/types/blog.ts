// Type definitions for blog components

// Category types
export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CategoryGroup {
  name: string;
  categories: Category[];
}

// Post types
export interface Author {
  id: number;
  name: string;
  avatar: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: Author;
  categoryId: number;
  tags: Tag[];
  publishedAt: string;
  readingTime: number;
}

// Blog post without author information
export interface BlogPostNoAuthor {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: number;
  tags: Tag[];
  publishedAt: string;
  readingTime: number;
} 