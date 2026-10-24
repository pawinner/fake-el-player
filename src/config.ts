/**
 * Site Status Configuration
 *
 * Controlled strictly via environment variable `VITE_SITE_OPEN`.
 *
 * Set in `.env` (local) or your hosting environment variables (e.g., Vercel):
 * - VITE_SITE_OPEN=true   : The backup site is active and usable (current behavior).
 * - VITE_SITE_OPEN=false  : player.docchula.com is back online (shows redirect notice in 3.. 2.. 1..).
 */
export const IS_SITE_OPEN: boolean =
  String(import.meta.env.VITE_SITE_OPEN ?? 'true').toLowerCase() === 'true';

export const OFFICIAL_SITE_URL = 'https://player.docchula.com/';
