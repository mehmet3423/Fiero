import { Product } from "@/constants/models/Product";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";

export const hasPercentageDiscount = (product: Product): boolean => {
  const p = product.productDiscounts?.[0];
  const s = product.subCategoryDiscounts?.[0];

  return (
    ((p?.isActive ?? false) &&
      (p?.isWithinActiveDateRange ?? false) &&
      p.discountValue > 0 &&
      p.discountValueType === DiscountValueType.Percentage) ||
    ((s?.isActive ?? false) &&
      (s?.isWithinActiveDateRange ?? false) &&
      s.discountValue > 0 &&
      s.discountValueType === DiscountValueType.Percentage)
  );
};

export const getFirstFixedDiscountValue = (product: Product): number | null => {
  const allDiscounts = [
    ...(product.productDiscounts || []),
    ...(product.subCategoryDiscounts || []),
  ];

  const fixed = allDiscounts.find(
    (d) =>
      d.isActive &&
      d.isWithinActiveDateRange &&
      d.discountValueType === DiscountValueType.FixedAmount
  );

  return fixed ? fixed.discountValue : null;
};

export const getPercentageDiscountValue = (product: Product): number | null => {
  const p = product.productDiscounts?.[0];
  const s = product.subCategoryDiscounts?.[0];

  // Check subcategory discount first
  if (
    s?.isActive &&
    s?.isWithinActiveDateRange &&
    s.discountValueType === DiscountValueType.Percentage
  ) {
    return s.discountValue;
  }

  // Check product discount second
  if (
    p?.isActive &&
    p?.isWithinActiveDateRange &&
    p.discountValueType === DiscountValueType.Percentage
  ) {
    return p.discountValue;
  }

  return null;
};

// Helper function to check if there's any active discount
export const hasAnyActiveDiscount = (product: Product): boolean => {
  const allDiscounts = [
    ...(product.productDiscounts || []),
    ...(product.subCategoryDiscounts || []),
  ];

  return allDiscounts.some(
    (discount) =>
      discount.isActive &&
      discount.isWithinActiveDateRange &&
      discount.discountValue > 0
  );
};

// Check if should show percentage badge (DiscountValueType = 0)
export const shouldShowPercentageBadge = (product: Product): boolean => {
  const allDiscounts = [
    ...(product.productDiscounts || []),
    ...(product.subCategoryDiscounts || []),
  ];

  return allDiscounts.some(
    (discount) =>
      discount.isActive &&
      discount.isWithinActiveDateRange &&
      discount.discountValue > 0 &&
      discount.discountValueType === DiscountValueType.Percentage
  );
};

// Check if should show fixed amount text (DiscountValueType = 1)
export const shouldShowFixedAmountText = (product: Product): boolean => {
  const allDiscounts = [
    ...(product.productDiscounts || []),
    ...(product.subCategoryDiscounts || []),
  ];

  return allDiscounts.some(
    (discount) =>
      discount.isActive &&
      discount.isWithinActiveDateRange &&
      discount.discountValue > 0 &&
      discount.discountValueType === DiscountValueType.FixedAmount
  );
};
