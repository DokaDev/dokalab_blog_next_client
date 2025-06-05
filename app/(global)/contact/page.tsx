'use client';

import { useState } from 'react';
import styles from './page.module.scss';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission for now
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.message;

  return (
    <div className={styles.container}>
      <div className={styles.contactHeader}>
        <h1>Get In Touch</h1>
        <p>
          I'd love to hear from you! Whether you have questions about my posts, 
          suggestions for topics, or just want to connect, feel free to reach out.
        </p>
      </div>

      <div className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <h2>Let's Connect</h2>
          <div className={styles.contactMethods}>
            <div className={styles.contactMethod}>
              <strong>Email</strong>
              <span>hello@dokalab.tech</span>
            </div>
            <div className={styles.contactMethod}>
              <strong>Response Time</strong>
              <span>Usually within 24-48 hours</span>
            </div>
            <div className={styles.contactMethod}>
              <strong>Best For</strong>
              <span>Questions, collaborations, feedback</span>
            </div>
          </div>
        </div>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <h2>Send a Message</h2>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your name"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              placeholder="What's this about?"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder="Tell me more..."
              rows={6}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitStatus === 'success' && (
            <div className={styles.successMessage}>
              Thank you for your message! I'll get back to you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className={styles.errorMessage}>
              Something went wrong. Please try again or email me directly.
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 