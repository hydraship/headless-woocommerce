/* eslint-disable no-console */
import { setCookie } from '@src/lib/helpers/cookie';

/**
 * Sets the WooCommerce session in both localStorage and cookies
 *
 * @param sessionValue - The WooCommerce session value to store
 * @param daysToLive - Number of days until the cookie expires (default: 30)
 * @returns void
 */
export const setWooSession = (sessionValue: string, daysToLive = 30): void => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    return;
  }

  try {
    // Set the session in cookies
    setCookie('woo-session', sessionValue, daysToLive);

    // Also store in localStorage for redundancy and easier access
    localStorage.setItem('woo-session', sessionValue);
  } catch (error) {
    console.error('Error setting WooCommerce session:', error);
  }
};

/**
 * Gets the WooCommerce session from localStorage or cookies
 * Prioritizes localStorage but falls back to cookies if not available
 *
 * @returns string | null - The session value or null if not found
 */
export const getWooSession = (): string | null => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    return null;
  }

  try {
    // Try to get from localStorage first
    const localStorageSession = localStorage.getItem('woo-session');

    if (localStorageSession) {
      return localStorageSession;
    }

    // Fall back to cookies if not in localStorage
    const cookieSession = document.cookie.split('; ').find((row) => row.startsWith('woo-session='));

    if (cookieSession) {
      return decodeURIComponent(cookieSession.split('=')[1]);
    }

    return null;
  } catch (error) {
    console.error('Error getting WooCommerce session:', error);
    return null;
  }
};

/**
 * Removes the WooCommerce session from both localStorage and cookies
 *
 * @returns void
 */
export const removeWooSession = (): void => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    return;
  }

  try {
    // Remove from localStorage
    localStorage.removeItem('woo-session');

    // Expire the cookie
    setCookie('woo-session', '', -1);
  } catch (error) {
    console.error('Error removing WooCommerce session:', error);
  }
};
