/**
 * Number formatting utilities
 */

/**
 * Format a number with appropriate suffixes (K, M, B)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num === 0) return '0';
  
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['', 'K', 'M', 'B', 'T'];
  
  const i = Math.floor(Math.log(num) / Math.log(k));
  
  if (i === 0) {
    return num.toString();
  }
  
  return parseFloat((num / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

/**
 * Format a number for display in large text (removes decimals for cleaner look)
 * @param num - The number to format
 * @returns Formatted number string without decimals
 */
export function formatBigNumber(num: number): string {
  return formatNumber(num, 0);
}