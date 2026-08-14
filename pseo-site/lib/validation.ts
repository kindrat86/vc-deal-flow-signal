/**
 * Shared validation utilities for API routes.
 */

/**
 * Stricter email validation.
 * Requires: local part, @, domain with dot, TLD of 2+ chars.
 */
export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/.test(email);
}

/**
 * Allowed origins for POST requests (CSRF protection).
 */
const ALLOWED_ORIGINS = [
  "https://gitdealflow.com",
  "https://www.gitdealflow.com",
  "https://signals.gitdealflow.com",
];

if (process.env.NODE_ENV !== "production") {
  ALLOWED_ORIGINS.push("http://localhost:3000", "http://localhost:8080");
}

/**
 * Validate that a POST request comes from an allowed origin.
 * Returns true if origin is allowed or absent (non-browser clients).
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  // No origin header = non-browser client (curl, API call), allow
  if (!origin) return true;
  return ALLOWED_ORIGINS.includes(origin);
}
