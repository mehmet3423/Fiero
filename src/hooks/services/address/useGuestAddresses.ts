import {
  GuestAddressFormData,
  GuestCheckoutAddresses,
} from "@/constants/models/Address";
import { useEffect, useState } from "react";

const STORAGE_KEY = "guestCheckoutAddresses";

// Validation helper
const validateGuestAddress = (
  address: GuestAddressFormData | null
): boolean => {
  if (!address) return false;

  const requiredFields: (keyof GuestAddressFormData)[] = [
    "firstName",
    "lastName",
    "phoneNumber",
    "title",
    "country",
    "city",
    "cityId",
    "district",
    "districtId",
    "fullAddress",
  ];

  return requiredFields.every(
    (field) => address[field] && address[field].trim() !== ""
  );
};

export const useGuestAddresses = () => {
  const [addresses, setAddresses] = useState<GuestCheckoutAddresses>({
    shipping: null,
    billing: null,
    useSameAddress: true,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load addresses from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GuestCheckoutAddresses;
        setAddresses(parsed);
      }
    } catch (error) {
      console.error("Error loading guest addresses:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save addresses to localStorage
  const saveGuestAddresses = (newAddresses: GuestCheckoutAddresses) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAddresses));
      setAddresses(newAddresses);
    } catch (error) {
      console.error("Error saving guest addresses:", error);
      throw error;
    }
  };

  // Update shipping address
  const updateShippingAddress = (address: GuestAddressFormData) => {
    const newAddresses: GuestCheckoutAddresses = {
      ...addresses,
      shipping: address,
      // If useSameAddress is true, also update billing
      billing: addresses.useSameAddress ? address : addresses.billing,
    };
    saveGuestAddresses(newAddresses);
  };

  // Update billing address
  const updateBillingAddress = (address: GuestAddressFormData) => {
    const newAddresses: GuestCheckoutAddresses = {
      ...addresses,
      billing: address,
    };
    saveGuestAddresses(newAddresses);
  };

  // Toggle same address flag
  const toggleSameAddress = (useSame: boolean) => {
    const newAddresses: GuestCheckoutAddresses = {
      ...addresses,
      useSameAddress: useSame,
      // If toggling to true, copy shipping to billing
      billing: useSame ? addresses.shipping : addresses.billing,
    };
    saveGuestAddresses(newAddresses);
  };

  // Clear addresses from localStorage
  const clearGuestAddresses = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setAddresses({
        shipping: null,
        billing: null,
        useSameAddress: true,
      });
    } catch (error) {
      console.error("Error clearing guest addresses:", error);
    }
  };

  // Validate addresses
  const validateAddresses = (): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (!validateGuestAddress(addresses.shipping)) {
      errors.push("Teslimat adresi eksik veya hatalı.");
    }

    if (!addresses.useSameAddress && !validateGuestAddress(addresses.billing)) {
      errors.push("Fatura adresi eksik veya hatalı.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return {
    addresses,
    isLoaded,
    updateShippingAddress,
    updateBillingAddress,
    toggleSameAddress,
    clearGuestAddresses,
    validateAddresses,
    hasShippingAddress: validateGuestAddress(addresses.shipping),
    hasBillingAddress:
      addresses.useSameAddress || validateGuestAddress(addresses.billing),
  };
};
