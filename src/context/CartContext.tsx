import { UserRole } from "@/constants/enums/UserRole";
import { Product } from "@/constants/models/Product";
import { CartBundle } from "@/constants/models/Cart";
import { useAuth } from "@/hooks/context/useAuth";
import { useLocalCart } from "@/hooks/local-storage/useLocalCart";
import { useGetLocalCartProducts } from "@/hooks/services/cart/useGetLocalCartProducts";
import {
  useAddToCart,
  useClearCart,
  useGetCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "@/hooks/services/shopping-cart/useCart";
import { createContext, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Bundle'ı Product tipine dönüştürme helper fonksiyonu
const convertBundleToProduct = (
  cartBundle: CartBundle
): Product & { quantity: number; isBundle: boolean } => {
  const bundleProducts = cartBundle.bundleDiscount.bundleDiscountProducts;
  const firstProduct = bundleProducts.find((p) => p.product)?.product;

  return {
    $id: cartBundle.id,
    id: cartBundle.bundleId,
    title: `Bundle Paketi (${bundleProducts.length} ürün)`,
    baseProductId: "",
    baseProduct: null,
    sellableQuantity: 99,
    averageRating: 0,
    ratingCount: 0,
    isOutlet: false,
    refundable: true,
    imageUrl:
      firstProduct?.baseImageUrl || "/assets/images/bundle-placeholder.jpg",
    banner: firstProduct?.banner || [],
    videoUrl: firstProduct?.videoUrl || "",
    effectedDiscountId: "",
    subCategoryId: firstProduct?.subCategoryId || "",
    subCategory: null,
    subcategorySpecifications: null,
    subCategorySpecificationIds: [],
    subCategorySpecificationOptions: [],
    comments: [],
    description: `${bundleProducts.length} ürünlü bundle paketi`,
    stockCode: `BUNDLE-${cartBundle.bundleId.substring(0, 8)}`,
    price: cartBundle.bundleDiscount.bundlePrice || 0,
    discountedPrice: cartBundle.bundleDiscount.bundlePrice || 0,
    discountDTO: null as any,
    baseImageUrl:
      firstProduct?.baseImageUrl || "/assets/images/bundle-placeholder.jpg",
    contentImageUrls: firstProduct?.contentImageUrls || [],
    isAvailable: true,
    barcodeNumber: "",
    seo: null,
    seoId: "",
    sellerId: "",
    seller: null,
    orderItems: [],
    technicalDetails: [],
    productDiscounts: [],
    subCategoryDiscounts: [],
    quantity: cartBundle.quantity,
    isBundle: true,
  };
};

interface CartContextType {
  cartProducts: (Product & { quantity: number; isBundle?: boolean })[];
  totalItems: number;
  initialLoading: boolean;
  updateLoading: boolean;
  removeLoading: boolean;
  addLoading: boolean;
  clearLoading: boolean;
  cargoPrice: number;
  cargoDiscountedPrice: number | null;
  // Backend'den gerçekten dönen fiyat bilgileri
  totalPrice: number;
  totalDiscountedPrice: number;
  addToCart: (
    productId: string,
    quantity?: number,
    bundleDiscountId?: string
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType>({
  cartProducts: [],
  totalItems: 0,
  initialLoading: false,
  updateLoading: false,
  removeLoading: false,
  addLoading: false,
  clearLoading: false,
  cargoPrice: 0,
  cargoDiscountedPrice: null,
  totalPrice: 0,
  totalDiscountedPrice: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userRole } = useAuth();
  const [cartProducts, setCartProducts] = useState<
    (Product & { quantity: number; isBundle?: boolean })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cargoPrice, setCargoPrice] = useState(0);
  const [cargoDiscountedPrice, setCargoDiscountedPrice] = useState<
    number | null
  >(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscountedPrice, setTotalDiscountedPrice] = useState(0);

  // Local Storage Hooks
  const {
    cartItems: localCartItems,
    totalItems: localTotalItems,
    isLoaded,
    addToCart: addToLocalCart,
    removeFromCart: removeFromLocalCart,
    updateQuantity: updateLocalQuantity,
    clearCart: clearLocalCart,
  } = useLocalCart();

  const { cartProducts: localCartProducts, isLoading: localProductsLoading } =
    useGetLocalCartProducts(localCartItems, isLoaded);

  // API Hooks
  const { cart: apiCart, isLoading: apiLoading } = useGetCart();
  const { addItem, isLoading: addLoading } = useAddToCart();
  const { removeItem, isLoading: removeLoading } = useRemoveFromCart();
  const { updateQuantity: updateApiQuantity, isLoading: updateLoading } =
    useUpdateCartQuantity();
  const { clearCart: clearApiCart, isLoading: clearLoading } = useClearCart();

  // Sepet ürünlerini güncelle (API veya Local'den)
  useEffect(() => {
    if (userRole === UserRole.CUSTOMER && apiCart) {
      // Normal ürünleri ekle
      const normalProducts = apiCart.cartProducts.map((item) => ({
        ...item.product,
        quantity: item.quantity,
        isBundle: false,
      }));

      // Bundle'ları "virtual" ürünler olarak ekle
      const bundleProducts = (apiCart.cartBundles || []).map((bundle) =>
        convertBundleToProduct(bundle)
      );

      // Tüm ürünleri birleştir
      const allProducts = [...normalProducts, ...bundleProducts];

      setCartProducts(allProducts);
      setCargoPrice(apiCart.cargoPrice || 0);
      setCargoDiscountedPrice(apiCart.cargoDiscountedPrice || null);
      setTotalPrice(apiCart.totalPrice || 0);
      setTotalDiscountedPrice(apiCart.totalDiscountedPrice || 0);
      setIsLoading(apiLoading);
    } else {
      setCartProducts(
        localCartProducts.map((p) => ({ ...p, isBundle: false }))
      );
      setCargoPrice(0);
      setCargoDiscountedPrice(null);
      setTotalPrice(0);
      setTotalDiscountedPrice(0);
      setIsLoading(localProductsLoading);
    }
  }, [userRole, apiCart, localCartProducts, apiLoading, localProductsLoading]);

  const handleAddToCart = async (
    productId: string,
    quantity: number = 1,
    bundleDiscountId?: string
  ) => {
    try {
      if (userRole === UserRole.CUSTOMER) {
        await addItem(productId, quantity, bundleDiscountId);
      } else {
        await addToLocalCart(productId, quantity);
        toast.success("Ürün sepete eklendi");
      }
    } catch (error) {
      toast.error("Ürün sepete eklenirken bir hata oluştu");
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      if (userRole === UserRole.CUSTOMER) {
        await removeItem(productId);
      } else {
        await removeFromLocalCart(productId);
        toast.success("Ürün sepetten kaldırıldı");
      }
    } catch (error) {
      toast.error("Ürün sepetten kaldırılırken bir hata oluştu");
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    // Miktar kontrolü
    if (quantity < 1) {
      return;
    }

    try {
      if (userRole === UserRole.CUSTOMER) {
        await updateApiQuantity(productId, quantity);
      } else {
        await updateLocalQuantity(productId, quantity);
        toast.success("Ürün miktarı güncellendi");
      }
    } catch (error) {
      toast.error("Ürün miktarı güncellenirken bir hata oluştu");
    }
  };

  const handleClearCart = async () => {
    try {
      if (userRole === UserRole.CUSTOMER) {
        await clearApiCart();
      } else {
        await clearLocalCart();
        toast.success("Sepet temizlendi");
      }
    } catch (error) {
      toast.error("Sepet temizlenirken bir hata oluştu");
    }
  };

  const value = {
    cartProducts,
    totalItems:
      userRole === UserRole.CUSTOMER ? cartProducts.length : localTotalItems,
    initialLoading: isLoading || localProductsLoading,
    updateLoading,
    removeLoading,
    addLoading,
    clearLoading,
    cargoPrice,
    cargoDiscountedPrice,
    totalPrice,
    totalDiscountedPrice,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
