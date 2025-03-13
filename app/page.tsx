'use client';

import styles from './page.module.scss';
import { useRef, useEffect } from 'react';

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (sectionsRef.current) {
        e.preventDefault();
        
        const direction = e.deltaY > 0 ? 1 : -1;
        const scrollPosition = sectionsRef.current.scrollTop;
        const windowHeight = window.innerHeight;
        
        const targetSection = Math.round((scrollPosition / windowHeight) + direction);
        const targetScrollPosition = targetSection * windowHeight;
        
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
        top: window.innerHeight,
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
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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