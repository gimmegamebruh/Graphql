/**
 * Utility functions for data formatting and manipulation
 */

/**
 * Calculates total XP from transactions array
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Total XP amount
 */
function sumXP(transactions) {
  return (transactions || []).reduce((sum, t) => sum + (t.amount || 0), 0);
}

/**
 * Formats XP amounts into human-readable strings (B, kB, MB)
 * @param {number} xp - XP amount to format
 * @returns {string} Formatted XP string
 */
function formatXP(xp) {
  const n = Number(xp) || 0;

  if (n < 1000) return `${Math.ceil(n)} B`;
  if (n < 1_000_000) return `${Math.ceil(n / 1000)} kB`;

  const mb = n / 1_000_000;
  return `${Math.ceil(mb * 100) / 100} MB`;
}

/**
 * Alias for formatXP - formats byte amounts
 * @param {number} bytes - Byte amount to format
 * @returns {string} Formatted byte string
 */
function formatBytes(bytes) {
  return formatXP(bytes);
}

/**
 * Formats ISO date strings to YYYY-MM-DD format
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date or "—" if invalid
 */
function fmtDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toISOString().slice(0, 10);
}

/**
 * Escapes HTML special characters for safe rendering
 * @param {string} s - String to escape
 * @returns {string} HTML-escaped string
 */
function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}