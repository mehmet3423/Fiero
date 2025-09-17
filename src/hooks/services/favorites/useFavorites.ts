import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import {
    FAVORITES,
    FAVORITES_ADD_PRODUCT,
    FAVORITES_CLEAR,
    FAVORITES_REMOVE_PRODUCT
} from "@/constants/links";
import { FavoritesResponseModel } from "@/constants/models/Favorites";
import { useAuth } from "@/hooks/context/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useGetData from "../../useGetData";
import useMyMutation from "../../useMyMutation";

// Favorileri çekmek için hook
export const useGetFavorites = () => {
    const { userProfile } = useAuth();
    const { data, isLoading, error, refetch } = useGetData<FavoritesResponseModel>({
        url: userProfile ? FAVORITES : undefined,
        queryKey: QueryKeys.FAVORITES,
        method: HttpMethod.GET
    });

    return {
        favorites: data,
        isLoading,
        error,
        refetchFavorites: refetch
    };
};

// Favorilere ürün eklemek için hook
export const useAddToFavorites = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const addProduct = async (productId: string) => {
        try {
            const params = new URLSearchParams({
                ProductId: productId.toString()
            }).toString();

            await mutateAsync({
                url: `${FAVORITES_ADD_PRODUCT}?${params}`,	
                method: HttpMethod.POST
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: [QueryKeys.FAVORITES] });
                    toast.success('Ürün favorilere eklendi');
                }
            });
        } catch (error) {
        }
    };

    return { addProduct, isLoading: isPending };
};

// Favorilerden ürün silmek için hook
export const useRemoveFromFavorites = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const removeProduct = async (productId: string) => {
        try {
            const params = new URLSearchParams({
                ProductId: productId.toString()
            }).toString();

            await mutateAsync({
                url: `${FAVORITES_REMOVE_PRODUCT}?${params}`,
                method: HttpMethod.DELETE
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: [QueryKeys.FAVORITES] });
                    toast.success('Ürün favorilerden kaldırıldı');
                }
            });
        } catch (error) {
        }
    };

    return { removeProduct, isLoading: isPending };
};

// Favorileri temizlemek için hook
export const useClearFavorites = () => {
    const { mutateAsync, isPending } = useMyMutation<string>();
    const { refetchFavorites } = useGetFavorites();

    const clearFavorites = async () => {
        try {
            await mutateAsync({
                url: FAVORITES_CLEAR,
                method: HttpMethod.DELETE
            }, {
                onSuccess: () => {
                    toast.success('Favoriler temizlendi');
                    refetchFavorites();
                }
            });
        } catch (error) {
        }
    };

    return { clearFavorites, isLoading: isPending };
}; 