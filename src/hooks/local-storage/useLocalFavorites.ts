import { LocalStorageKeys } from "@/constants/enums/LocalStorage";
import { useEffect, useState } from "react";

export const useLocalFavorites = () => {
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [totalFavorites, setTotalFavorites] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedFavorites = localStorage.getItem(LocalStorageKeys.FAVORITES);
        if (storedFavorites) {
            const parsedFavoriteIds = JSON.parse(storedFavorites);
            setFavoriteIds(parsedFavoriteIds);
            setTotalFavorites(parsedFavoriteIds.length);
        }
        setIsLoaded(true);
    }, []);

    const addToFavorites = async (productId: string) => {
        const currentFavoriteIds = await JSON.parse(localStorage.getItem(LocalStorageKeys.FAVORITES) || '[]');
        if (!currentFavoriteIds.includes(productId)) {
            const newFavoriteIds = [...currentFavoriteIds, productId];
            localStorage.setItem(LocalStorageKeys.FAVORITES, JSON.stringify(newFavoriteIds));
            setFavoriteIds(newFavoriteIds);
            setTotalFavorites(newFavoriteIds.length);
        }
    };

    const removeFromFavorites = async (productId: string) => {
        const currentFavoriteIds = await JSON.parse(localStorage.getItem(LocalStorageKeys.FAVORITES) || '[]');
        const newFavoriteIds = currentFavoriteIds.filter((id: string) => id !== productId);
        await localStorage.setItem(LocalStorageKeys.FAVORITES, JSON.stringify(newFavoriteIds));
        setFavoriteIds(newFavoriteIds);
        setTotalFavorites(newFavoriteIds.length);
    };

    const isInFavorites = (productId: string) => {
        return favoriteIds.includes(productId);
    };

    const clearFavorites = () => {
        setFavoriteIds([]);
        setTotalFavorites(0);
        localStorage.removeItem(LocalStorageKeys.FAVORITES);
    };

    return {
        favoriteIds,
        totalFavorites,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        clearFavorites,
        isLoaded
    };
}; 