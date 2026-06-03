// Mauritian Rupee (MUR) currency formatting.
export const CURRENCY_CODE = 'MUR';
export const CURRENCY_SYMBOL = 'Rs';

/**
 * Formats a numeric amount as Mauritian Rupees, e.g. 1234.5 -> "Rs 1,234.50".
 */
export function formatPrice(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  const formatted = value.toLocaleString('en-MU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${CURRENCY_SYMBOL} ${formatted}`;
}
