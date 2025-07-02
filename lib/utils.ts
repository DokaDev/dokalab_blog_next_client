/**
 * Format a date string to a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string like "Sep 15, 2023"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Truncate a string to a specified length
 * @param str String to truncate
 * @param length Maximum length
 * @returns Truncated string with ellipsis
 */
export function truncateText(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Generate a random number between min and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random number
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 