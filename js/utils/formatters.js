function sumXP(transactions) {
  return (transactions || []).reduce((sum, t) => sum + (t.amount || 0), 0);
}

function formatXP(xp) {
  const n = Number(xp) || 0;

  if (n < 1000) return `${Math.ceil(n)} B`;
  if (n < 1_000_000) return `${Math.ceil(n / 1000)} kB`;

  const mb = n / 1_000_000;
  return `${Math.ceil(mb * 100) / 100} MB`;
}

function formatBytes(bytes) {
  return formatXP(bytes);
}

function fmtDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toISOString().slice(0, 10);
}

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
