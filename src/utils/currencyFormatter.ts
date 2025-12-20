/**
 * Formats a number as Turkish Lira currency
 * @param amount - Amount to format
 * @param includeSymbol - Whether to include currency symbol (default: true)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  includeSymbol: boolean = true
): string => {
  if (includeSymbol) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  }

  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats price with custom decimal places
 */
export const formatPrice = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};
