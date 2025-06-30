'use client';

import styles from './page.module.scss';
import { useRef, useEffect } from 'react';

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement>(null);

  /*
   * API CALL: Get homepage statistics and featured content
   * 
   * GET /api/home/stats
   * 
   * Response:
   * {
   *   "data": {
   *     "stats": {
   *       "totalPosts": 150,
   *       "totalViews": 45678,
   *       "totalCategories": 9,
   *       "totalTags": 25
   *     },
   *     "featuredPosts": [
   *       {
   *         "id": 1,
   *         "title": "Getting Started with Next.js",
   *         "excerpt": "Learn how to build modern web applications...",
   *         "coverImage": "https://example.com/image.jpg",
   *         "publishedAt": "2023-09-15T00:00:00Z",
   *         "readingTime": 8,
   *         "category": { "id": 1, "name": "Web Development" },
   *         "slug": "getting-started-with-nextjs"
   *       }
   *     ],
   *     "popularCategories": [
   *       {
   *         "id": 1,
   *         "name": "Web Development",
   *         "slug": "web-development",
   *         "postCount": 45,
   *         "icon": "🌐"
   *       },
   *       {
   *         "id": 4,
   *         "name": "Machine Learning",
   *         "slug": "machine-learning",
   *         "postCount": 38,
   *         "icon": "🤖"
   *       },
   *       {
   *         "id": 7,
   *         "name": "Distributed Systems",
   *         "slug": "distributed-systems",
   *         "postCount": 32,
   *         "icon": "🔗"
   *       }
   *     ],
   *     "recentActivity": {
   *       "lastPostDate": "2023-09-20T10:00:00Z",
   *       "postsThisMonth": 12,
   *       "commentsThisWeek": 234
   *     }
   *   }
   * }
   */

  /*
   * API CALL: Get latest posts for homepage (optional)
   * 
   * GET /api/posts?page=1&pageSize=6&sort=date&order=desc
   * 
   * Response: Same as blog list page
   */

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (sectionsRef.current) {
        e.preventDefault();
        
        const direction = e.deltaY > 0 ? 1 : -1;
        const scrollPosition = sectionsRef.current.scrollTop;
        const sectionHeight = window.innerHeight; // Use full viewport height for section sizing
        
        const targetSection = Math.round((scrollPosition / sectionHeight) + direction);
        const targetScrollPosition = targetSection * sectionHeight;
        
        sectionsRef.current.scrollTo({
          top: targetScrollPosition,
          behavior: 'smooth'
        });
      }
    };

    const sectionsElement = sectionsRef.current;
    if (sectionsElement) {
      sectionsElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (sectionsElement) {
        sectionsElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleScrollDown = () => {
    if (sectionsRef.current) {
      sectionsRef.current.scrollTo({
        top: window.innerHeight, // Use full viewport height for scroll calculation
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.sectionsContainer} ref={sectionsRef}>
      {/* First Section - Hero */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Unleash Your Digital <br />Potential with <span>DokaLab</span>
            </h1>
            <div className={styles.descriptionCard}>
              <p className={styles.description}>
                Delving into the crossroads of technology and creativity, offering in-depth insights, tutorials, and challenging articles across various fields like systems, AI, and web development.
              </p>
              <div className={styles.socialLinks}>
                <a href="https://github.com/DokaDev" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.934.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.48A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                <a href="https://twitter.com/dokadev" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M22 5.8a8.49 8.49 0 01-2.36.64 4.13 4.13 0 001.81-2.27 8.21 8.21 0 01-2.61 1 4.1 4.1 0 00-7 3.74 11.64 11.64 0 01-8.45-4.29 4.16 4.16 0 001.27 5.49 4.09 4.09 0 01-1.86-.52v.05a4.1 4.1 0 003.3 4 4.05 4.05 0 01-1.9.08 4.11 4.11 0 003.83 2.85A8.22 8.22 0 012 18.28a11.57 11.57 0 006.29 1.85A11.59 11.59 0 0020 8.45v-.53a8.43 8.43 0 002-2.12z" />
                  </svg>
                </a>
                <a href="https://instagram.com/nj_acunsorii" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041 0 2.67.01 2.986.058 4.04.045.977.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041 0-2.67-.01-2.986-.058-4.04-.045-.977-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.041-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className={styles.scrollIndicator} onClick={handleScrollDown}>
            <span>Scroll Down</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Second Section - Featured Content */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.featuredContent}>
            <h2 className={styles.sectionTitle}>Featured Content</h2>
            <div className={styles.featuredGrid}>
              <div className={styles.featuredCard}>
                <h3>Web Development</h3>
                <p>Explore modern web technologies and best practices for building responsive, accessible websites.</p>
                <a href="/blog/web-development" className={styles.featuredLink}>
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/>
                  </svg>
                </a>
              </div>
              <div className={styles.featuredCard}>
                <h3>AI & Machine Learning</h3>
                <p>Dive into artificial intelligence concepts, machine learning frameworks, and practical applications.</p>
                <a href="/blog/ai" className={styles.featuredLink}>
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/>
                  </svg>
                </a>
              </div>
              <div className={styles.featuredCard}>
                <h3>System Design</h3>
                <p>Learn about architecture patterns, scalability solutions, and distributed systems design.</p>
                <a href="/blog/systems" className={styles.featuredLink}>
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}