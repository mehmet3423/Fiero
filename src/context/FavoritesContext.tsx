import { UserRole } from "@/constants/enums/UserRole";
import { Product } from "@/constants/models/Product";
import { useAuth } from "@/hooks/context/useAuth";
import { useLocalFavorites } from "@/hooks/local-storage/useLocalFavorites";
import {
  useAddToFavorites,
  useClearFavorites,
  useGetFavorites,
  useRemoveFromFavorites,
} from "@/hooks/services/favorites/useFavorites";
import { useGetLocalFavoriteProducts } from "@/hooks/services/favorites/useGetLocalFavoriteProducts";
import { createContext, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface FavoritesContextType {
  favorites: Product[];
  totalFavorites: number;
  isLoading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  isInFavorites: (productId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  totalFavorites: 0,
  isLoading: false,
  addToFavorites: async () => {},
  removeFromFavorites: async () => {},
  clearFavorites: async () => {},
  isInFavorites: () => false,
});

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { userRole } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Local Storage Hooks
  const {
    favoriteIds,
    isLoaded,
    addToFavorites: addToLocalFavorites,
    removeFromFavorites: removeFromLocalFavorites,
    clearFavorites: clearLocalFavorites,
    isInFavorites: isInLocalFavorites,
  } = useLocalFavorites();

  const {
    favoriteProducts: localFavoriteProducts,
    isLoading: localProductsLoading,
  } = useGetLocalFavoriteProducts(favoriteIds, isLoaded);

  // API Hooks
  const { favorites: apiFavorites, isLoading: apiLoading } = useGetFavorites();
  const { addProduct, isLoading: addLoading } = useAddToFavorites();
  const { removeProduct, isLoading: removeLoading } = useRemoveFromFavorites();
  const { clearFavorites: clearApiFavorites, isLoading: clearLoading } =
    useClearFavorites();

  // Favori ürünleri güncelle (API veya Local'den)
  useEffect(() => {
    if (userRole === UserRole.CUSTOMER) {
      if (apiFavorites?.data && apiFavorites.isSucceed) {
        setFavorites(apiFavorites.data.items || []);
      } else {
        setFavorites([]); // 👈 API'den null dönerse bile sıfırlanmalı
      }
      setIsLoading(apiLoading);
    } else {
      setFavorites(localFavoriteProducts || []);
      setIsLoading(localProductsLoading);
    }
  }, [
    userRole,
    apiFavorites,
    localFavoriteProducts,
    apiLoading,
    localProductsLoading,
  ]);

  const handleAddToFavorites = async (productId: string) => {
    try {
      if (userRole === UserRole.CUSTOMER) {
        await addProduct(productId);
      } else {
        addToLocalFavorites(productId);
        toast.success("Ürün favorilere eklendi");
      }
    } catch (error) {
      toast.error("Ürün favorilere eklenirken bir hata oluştu");
    }
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      if (userRole === UserRole.CUSTOMER) {
        await removeProduct(productId);
      } else {
        removeFromLocalFavorites(productId);
        toast.success("Ürün favorilerden kaldırıldı");
      }
    } catch (error) {
      toast.error("Ürün favorilerden kaldırılırken bir hata oluştu");
    }
  };

  const handleClearFavorites = async () => {
    try {
      if (userRole === UserRole.CUSTOMER) {
        await clearApiFavorites();
      } else {
        clearLocalFavorites();
        toast.success("Favoriler temizlendi");
      }
    } catch (error) {
      toast.error("Favoriler temizlenirken bir hata oluştu");
    }
  };

  const isProductInFavorites = (productId: string) => {
    if (userRole === UserRole.CUSTOMER) {
      return favorites.some((product) => product.id === productId);
    }
    return isInLocalFavorites(productId);
  };

  const value = {
    favorites,
    totalFavorites: favorites.length,
    isLoading: isLoading || apiLoading || localProductsLoading,
    addToFavorites: handleAddToFavorites,
    removeFromFavorites: handleRemoveFromFavorites,
    clearFavorites: handleClearFavorites,
    isInFavorites: isProductInFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
