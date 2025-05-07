import { CategoryGroup, BlogPost } from '../types/blog';

// Mock category data
export const categoryGroups: CategoryGroup[] = [
  {
    name: 'Development',
    categories: [
      { id: 1, name: 'Web Development', description: 'Articles about frontend and backend web development' },
      { id: 2, name: 'Mobile Development', description: 'Native and cross-platform mobile app development' },
      { id: 3, name: 'DevOps', description: 'CI/CD, deployment, and infrastructure automation' }
    ]
  },
  {
    name: 'AI & Data',
    categories: [
      { id: 4, name: 'Machine Learning', description: 'Machine learning concepts and applications' },
      { id: 5, name: 'Data Science', description: 'Data analysis, visualization, and statistical methods' },
      { id: 6, name: 'Computer Vision', description: 'Image processing and visual data analysis' }
    ]
  },
  {
    name: 'Systems',
    categories: [
      { id: 7, name: 'Distributed Systems', description: 'Distributed architecture and scalability' },
      { id: 8, name: 'Cloud Computing', description: 'Cloud platforms, services, and best practices' },
      { id: 9, name: 'System Design', description: 'Architecture patterns and system design principles' }
    ]
  }
];

// Mock authors
const authors = [
  { id: 1, name: 'John Doe', avatar: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
  { id: 2, name: 'Jane Smith', avatar: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
  { id: 3, name: 'Alex Johnson', avatar: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' }
];

// Mock tags
const tags = [
  { id: 1, name: 'React' },
  { id: 2, name: 'Next.js' },
  { id: 3, name: 'TypeScript' },
  { id: 4, name: 'JavaScript' },
  { id: 5, name: 'Python' },
  { id: 6, name: 'AWS' },
  { id: 7, name: 'Docker' },
  { id: 8, name: 'Kubernetes' },
  { id: 9, name: 'TensorFlow' },
  { id: 10, name: 'PyTorch' }
];

// Mock blog posts
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '1. Getting Started with Next.js and TypeScript',
    excerpt: 'Learn how to set up a new project with Next.js and TypeScript from scratch.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[0],
    categoryId: 1,
    tags: [tags[1], tags[2]],
    publishedAt: '2023-09-15',
    readingTime: 8
  },
  {
    id: 2,
    title: '2. Optimizing React Performance',
    excerpt: 'Techniques and best practices to improve your React application performance.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[1],
    categoryId: 1,
    tags: [tags[0], tags[3]],
    publishedAt: '2023-08-28',
    readingTime: 12
  },
  {
    id: 3,
    title: '3. Building a CI/CD Pipeline with GitHub Actions',
    excerpt: 'Learn how to automate your development workflow using GitHub Actions.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[2],
    categoryId: 3,
    tags: [tags[6], tags[7]],
    publishedAt: '2023-07-12',
    readingTime: 10
  },
  {
    id: 4,
    title: '4. Introduction to Machine Learning with TensorFlow',
    excerpt: 'A beginner-friendly guide to machine learning fundamentals using TensorFlow.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[0],
    categoryId: 4,
    tags: [tags[8], tags[4]],
    publishedAt: '2023-06-20',
    readingTime: 15
  },
  {
    id: 5,
    title: '5. Serverless Architecture on AWS',
    excerpt: 'Explore the benefits and implementation of serverless architecture using AWS services.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[1],
    categoryId: 8,
    tags: [tags[5], tags[6]],
    publishedAt: '2023-05-18',
    readingTime: 9
  },
  {
    id: 6,
    title: '6. Deep Learning for Computer Vision',
    excerpt: 'How to use PyTorch to build deep learning models for image recognition.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[2],
    categoryId: 6,
    tags: [tags[9], tags[4]],
    publishedAt: '2023-04-05',
    readingTime: 14
  },
  {
    id: 7,
    title: '7. Microservices Architecture Patterns',
    excerpt: 'Common patterns and best practices for designing microservices-based systems.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[0],
    categoryId: 7,
    tags: [tags[6], tags[7]],
    publishedAt: '2023-03-22',
    readingTime: 11
  },
  {
    id: 8,
    title: '8. Mobile App Development with React Native',
    excerpt: 'Build cross-platform mobile applications using React Native and TypeScript.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[1],
    categoryId: 2,
    tags: [tags[0], tags[2]],
    publishedAt: '2023-02-14',
    readingTime: 10
  },
  {
    id: 9,
    title: '9. GraphQL vs REST: Choosing the Right API',
    excerpt: 'Compare GraphQL and REST API approaches and learn when to use each one.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[2],
    categoryId: 1,
    tags: [tags[3], tags[0]],
    publishedAt: '2023-01-28',
    readingTime: 9
  },
  {
    id: 10,
    title: '10. Kubernetes for Beginners',
    excerpt: 'Get started with container orchestration using Kubernetes.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[0],
    categoryId: 3,
    tags: [tags[6], tags[7]],
    publishedAt: '2023-01-15',
    readingTime: 13
  },
  {
    id: 11,
    title: '11. Introduction to Data Science with Python',
    excerpt: 'Learn the fundamentals of data science using Python and popular libraries.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[1],
    categoryId: 5,
    tags: [tags[4], tags[8]],
    publishedAt: '2022-12-20',
    readingTime: 11
  },
  {
    id: 12,
    title: '12. Securing Your React Application',
    excerpt: 'Best practices for securing your frontend React applications against common vulnerabilities.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[2],
    categoryId: 1,
    tags: [tags[0], tags[3]],
    publishedAt: '2022-12-05',
    readingTime: 10
  },
  {
    id: 13,
    title: '13. Scaling Distributed Systems',
    excerpt: 'Strategies for scaling distributed systems to handle growing traffic and data.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[0],
    categoryId: 7,
    tags: [tags[6], tags[7]],
    publishedAt: '2022-11-18',
    readingTime: 14
  },
  {
    id: 14,
    title: '14. Flutter vs React Native',
    excerpt: 'A comparison of two popular frameworks for cross-platform mobile development.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[1],
    categoryId: 2,
    tags: [tags[0], tags[3]],
    publishedAt: '2022-11-02',
    readingTime: 9
  },
  {
    id: 15,
    title: '15. Natural Language Processing with BERT',
    excerpt: 'How to use BERT models for advanced natural language processing tasks.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[2],
    categoryId: 4,
    tags: [tags[8], tags[4]],
    publishedAt: '2022-10-25',
    readingTime: 12
  },
  {
    id: 16,
    title: '16. Cloud Security Best Practices',
    excerpt: 'Essential security practices for protecting your cloud infrastructure and applications.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[0],
    categoryId: 8,
    tags: [tags[5], tags[6]],
    publishedAt: '2022-10-10',
    readingTime: 11
  },
  {
    id: 17,
    title: '17. TypeScript Advanced Patterns',
    excerpt: 'Master advanced TypeScript patterns to write more type-safe and maintainable code.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[1],
    categoryId: 1,
    tags: [tags[2], tags[3]],
    publishedAt: '2022-09-28',
    readingTime: 14
  },
  {
    id: 18,
    title: '18. Image Recognition with Convolutional Neural Networks',
    excerpt: 'Implementing image recognition systems using convolutional neural networks.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[2],
    categoryId: 6,
    tags: [tags[9], tags[4]],
    publishedAt: '2022-09-15',
    readingTime: 13
  },
  {
    id: 19,
    title: '19. Docker Compose for Local Development',
    excerpt: 'Streamline your local development environment with Docker Compose.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[0],
    categoryId: 3,
    tags: [tags[6], tags[7]],
    publishedAt: '2022-08-30',
    readingTime: 8
  },
  {
    id: 20,
    title: '20. State Management in React',
    excerpt: 'Comparing different state management approaches in React applications.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[1],
    categoryId: 1,
    tags: [tags[0], tags[3]],
    publishedAt: '2022-08-18',
    readingTime: 11
  },
  {
    id: 21,
    title: '21. Building RESTful APIs with Node.js',
    excerpt: 'A comprehensive guide to designing and developing RESTful APIs with Node.js.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[2],
    categoryId: 1,
    tags: [tags[3], tags[1]],
    publishedAt: '2022-08-05',
    readingTime: 12
  },
  {
    id: 22,
    title: '22. Introduction to Reinforcement Learning',
    excerpt: 'Understanding the fundamentals of reinforcement learning algorithms.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[0],
    categoryId: 4,
    tags: [tags[8], tags[4]],
    publishedAt: '2022-07-22',
    readingTime: 15
  },
  {
    id: 23,
    title: '23. AWS Lambda and Serverless Framework',
    excerpt: 'Build serverless applications with AWS Lambda and the Serverless Framework.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[1],
    categoryId: 8,
    tags: [tags[5], tags[6]],
    publishedAt: '2022-07-10',
    readingTime: 10
  },
  {
    id: 24,
    title: '24. Modern CSS Techniques',
    excerpt: 'Advanced CSS techniques and best practices for modern web development.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[2],
    categoryId: 1,
    tags: [tags[3], tags[0]],
    publishedAt: '2022-06-28',
    readingTime: 9
  },
  {
    id: 25,
    title: '25. Real-time Applications with WebSockets',
    excerpt: 'Building real-time applications using WebSockets and Socket.io.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[0],
    categoryId: 1,
    tags: [tags[3], tags[1]],
    publishedAt: '2022-06-15',
    readingTime: 11
  },
  {
    id: 26,
    title: '26. System Design Interview Preparation',
    excerpt: 'How to prepare for and excel in system design interviews.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[1],
    categoryId: 9,
    tags: [tags[6], tags[7]],
    publishedAt: '2022-06-02',
    readingTime: 14
  },
  {
    id: 27,
    title: '27. Progressive Web Apps (PWA)',
    excerpt: 'Building fast, reliable, and engaging web experiences with Progressive Web Apps.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[2],
    categoryId: 1,
    tags: [tags[3], tags[0]],
    publishedAt: '2022-05-20',
    readingTime: 10
  },
  {
    id: 28,
    title: '28. Data Visualization with D3.js',
    excerpt: 'Creating interactive and dynamic data visualizations using D3.js.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[0],
    categoryId: 5,
    tags: [tags[3], tags[4]],
    publishedAt: '2022-05-08',
    readingTime: 12
  },
  {
    id: 29,
    title: '29. Accessibility in Web Development',
    excerpt: 'Making your web applications accessible to all users, including those with disabilities.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: authors[1],
    categoryId: 1,
    tags: [tags[0], tags[3]],
    publishedAt: '2022-04-25',
    readingTime: 9
  },
  {
    id: 30,
    title: '30. Blockchain Technology Explained',
    excerpt: 'Understanding the fundamentals of blockchain technology and its applications.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    coverImage: 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg',
    author: authors[2],
    categoryId: 9,
    tags: [tags[3], tags[5]],
    publishedAt: '2022-04-12',
    readingTime: 13
  }
];

// Helper function to get posts by category ID
export const getPostsByCategoryId = (categoryId: number): BlogPost[] => {
  return blogPosts.filter(post => post.categoryId === categoryId);
};

// Helper function to get category by ID
export const getCategoryById = (categoryId: number) => {
  for (const group of categoryGroups) {
    const category = group.categories.find(cat => cat.id === categoryId);
    if (category) return category;
  }
  return null;
}; 