import { LocalStorageKeys } from "@/constants/enums/LocalStorage";
import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  quantity: number;
}

export const useLocalCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // LocalStorage'dan sepet verilerini oku
  const getCartFromStorage = async (): Promise<CartItem[]> => {
    return new Promise((resolve) => {
      const storedCart = localStorage.getItem(LocalStorageKeys.CART);
      resolve(storedCart ? JSON.parse(storedCart) : []);
    });
  };

  // State'leri güncelle
  const updateStates = async (newItems: CartItem[]) => {
    return new Promise<void>((resolve) => {
      setCartItems(newItems);
      setTotalItems(calculateTotalItems(newItems));
      resolve();
    });
  };

  // LocalStorage'a kaydet
  const saveToStorage = async (newItems: CartItem[]) => {
    return new Promise<void>((resolve) => {
      localStorage.setItem(LocalStorageKeys.CART, JSON.stringify(newItems));
      resolve();
    });
  };

  useEffect(() => {
    const initializeCart = async () => {
      const items = await getCartFromStorage();
      await updateStates(items);
      setIsLoaded(true);
    };
    initializeCart();
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    // Quantity kontrolü
    if (quantity <= 0) {
      return;
    }

    const currentItems = await getCartFromStorage();
    const existingItem = currentItems.find(item => item.id === productId);

    let newItems: CartItem[];
    if (existingItem) {
      newItems = currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [...currentItems, { id: productId, quantity }];
    }

    await saveToStorage(newItems);
    await updateStates(newItems);
  };

  const removeFromCart = async (productId: string) => {
    const currentItems = await getCartFromStorage();
    const newItems = currentItems.filter(item => item.id !== productId);
    await saveToStorage(newItems);
    await updateStates(newItems);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    // Miktar kontrolü
    if (quantity <= 0) {
      return;
    }

    const currentItems = await getCartFromStorage();
    const newItems = currentItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    await saveToStorage(newItems);
    await updateStates(newItems);
  };

  const clearCart = async () => {
    await new Promise<void>((resolve) => {
      localStorage.removeItem(LocalStorageKeys.CART);
      resolve();
    });
    await updateStates([]);
  };

  const calculateTotalItems = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoaded
  };
}; 