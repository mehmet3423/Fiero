import { DiscountValueType } from "@/constants/enums/DiscountValueType";

export const getDiscountValueTypeTitle = (type: DiscountValueType): string => {
  switch (type) {
    case DiscountValueType.Percentage:
      return "Yüzdelik İndirim";
    case DiscountValueType.FixedAmount:
      return "Sabit İndirim";
    default:
      return "Bilinmeyen İndirim Tipi";
  }
};

export const getAllDiscountValueTypes = (): {
  value: DiscountValueType;
  title: string;
}[] => {
  return [
    { value: DiscountValueType.Percentage, title: "Yüzdelik İndirim" },
    { value: DiscountValueType.FixedAmount, title: "Sabit İndirim" },
  ];
};
