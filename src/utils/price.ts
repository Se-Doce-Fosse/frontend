export function parseBRLToCents(priceBRL: string): number {
  const normalized = priceBRL
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

/**
 * Normalize a decimal input typed by user: replace comma with dot and trim spaces.
 * Keeps the rest of the string intact so the caller can decide further validation.
 */
export function normalizeDecimalString(input: string | undefined): string {
  if (!input && input !== '') return '';
  const s = String(input).trim();
  return s.replace(/\s+/g, '').replace(/,/g, '.');
}

/**
 * Format a numeric value (or numeric string) to Brazilian format using comma
 * as decimal separator and two fraction digits, e.g. 12.5 -> "12,50".
 */
export function formatToBR(value: string | number | undefined): string {
  if (value === undefined || value === null) return '';
  let num: number;
  if (typeof value === 'string') {
    const normalized = normalizeDecimalString(value);
    num = Number.parseFloat(normalized);
  } else {
    num = value;
  }
  if (!Number.isFinite(num)) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
