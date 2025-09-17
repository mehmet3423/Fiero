import { UserRole } from "@/constants/enums/UserRole";
import { Product } from "@/constants/models/Product";
import { CartBundle, CartFreeProduct } from "@/constants/models/Cart";
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
    discountResponse: null as any,
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

// Ücretsiz ürün indirimlerini mevcut ürünlere uygula (yeni/esk i model uyumlu)
const applyFreeProductDiscounts = (
  normalProducts: (Product & {
    quantity: number;
    isBundle: boolean;
    isFreeProduct: boolean;
    freeQuantity?: number;
    giftAmount?: number;
  })[],
  cartFreeProducts: CartFreeProduct[]
): (Product & {
  quantity: number;
  isBundle: boolean;
  isFreeProduct: boolean;
  freeQuantity?: number;
  giftAmount?: number;
})[] => {
  const updatedProducts = [...normalProducts];

  // Yardımcı: sepetteki bir ürüne ücretsiz miktar uygula
  const markAsFree = (productId: string, freeQty: number = 0) => {
    const index = updatedProducts.findIndex(
      (p) => p.id === productId && !p.isBundle
    );
    if (index !== -1) {
      const prev = updatedProducts[index];
      updatedProducts[index] = {
        ...prev,
        isFreeProduct: freeQty > 0,
        discountedPrice: freeQty > 0 ? prev.price : prev.discountedPrice, // Orijinal fiyatı koru, hesaplama UI'da yapılacak
        freeQuantity: freeQty,
        giftAmount: freeQty, // giftAmount bilgisini ekle
      };
    }
  };

  cartFreeProducts.forEach((freeProduct) => {
    // Yeni model: freeProductDiscountProducts array'i içindeki her ürün için giftAmount uygula
    if (
      freeProduct.freeProductDiscountProducts &&
      freeProduct.freeProductDiscountProducts.length > 0
    ) {
      freeProduct.freeProductDiscountProducts.forEach((freeProductItem) => {
        if (
          freeProductItem.productId &&
          freeProductItem.giftAmount !== undefined
        ) {
          markAsFree(
            freeProductItem.productId,
            Number(freeProductItem.giftAmount)
          );
        }
      });
      return;
    }

    // Eski model: indirim objesi içindeki id listesi (her biri 1 adet ücretsiz)
    const fromDiscount = freeProduct.freeProductDiscount?.freeProductIds || [];
    fromDiscount.forEach((id) => markAsFree(id, 1));

    // Bazı sürümlerde üst seviyede freeProductIds gelebilir (her biri 1 adet ücretsiz)
    const fromTopLevel = freeProduct.freeProductIds || [];
    fromTopLevel.forEach((id) => markAsFree(id, 1));
  });

  return updatedProducts;
};

// BuyXPayY indirimlerini mevcut ürünlere uygula
const applyBuyXPayYDiscounts = (
  normalProducts: (Product & {
    quantity: number;
    isBundle: boolean;
    isFreeProduct: boolean;
    freeQuantity?: number;
    isBuyXPayY?: boolean;
    buyXCount?: number;
    payYCount?: number;
  })[],
  cartBuyXPayYs: any[]
): (Product & {
  quantity: number;
  isBundle: boolean;
  isFreeProduct: boolean;
  freeQuantity?: number;
  isBuyXPayY?: boolean;
  buyXCount?: number;
  payYCount?: number;
})[] => {
  const updatedProducts = [...normalProducts];

  // Yardımcı: sepetteki bir ürüne buyXPayY indirimi uygula
  const markAsBuyXPayY = (
    productId: string,
    buyXCount: number,
    payYCount: number
  ) => {
    const index = updatedProducts.findIndex(
      (p) => p.id === productId && !p.isBundle
    );
    if (index !== -1) {
      const prev = updatedProducts[index];
      updatedProducts[index] = {
        ...prev,
        isBuyXPayY: true,
        buyXCount: buyXCount,
        payYCount: payYCount,
      };
    }
  };

  cartBuyXPayYs.forEach((buyXPayY) => {
    if (buyXPayY.buyXPayYDiscount && buyXPayY.selectedProductId) {
      const { buyXCount, payYCount } = buyXPayY.buyXPayYDiscount;
      markAsBuyXPayY(buyXPayY.selectedProductId, buyXCount, payYCount);
    }
  });

  return updatedProducts;
};

interface CartContextType {
  cartProducts: (Product & {
    quantity: number;
    isBundle?: boolean;
    isFreeProduct?: boolean;
    isBuyXPayY?: boolean;
    buyXCount?: number;
    payYCount?: number;
  })[];
  totalItems: number;
  initialLoading: boolean;
  cartDiscount: {
    discountValueType: number;
    discountValue: number;
  } | null;
  updateLoading: boolean;
  removeLoading: boolean;
  addLoading: boolean;
  clearLoading: boolean;
  cargoPrice: number;
  cargoDiscountedPrice: number | null;
  minimumCargoAmount: number | null;
  giftWrapPrice: number; // Hediye paketi fiyatı
  // Backend'den gerçekten dönen fiyat bilgileri
  totalPrice: number;
  totalDiscountedPrice: number;
  totalProductPhaseDiscountedPrice: number;
  // Hediye paketi state'leri
  isGiftWrap: boolean;
  giftWrapMessage: string;
  // Kupon kodu state'leri
  appliedCoupon: any;
  couponCode: string;
  totalDiscountlessPrice: number;
  addToCart: (
    productId: string,
    quantity?: number,
    bundleDiscountId?: string
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateGiftWrap: (isGiftWrap: boolean, message?: string) => Promise<void>;
  applyCoupon: (couponCode: string, couponData?: any) => Promise<void>;
  removeCoupon: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartProducts: [],
  cartDiscount: null,
  totalItems: 0,
  initialLoading: false,
  updateLoading: false,
  removeLoading: false,
  addLoading: false,
  clearLoading: false,
  cargoPrice: 0,
  cargoDiscountedPrice: null,
  minimumCargoAmount: null,
  giftWrapPrice: 0,
  totalPrice: 0,
  totalProductPhaseDiscountedPrice: 0,
  totalDiscountedPrice: 0,
  isGiftWrap: false,
  giftWrapMessage: "",
  appliedCoupon: null,
  couponCode: "",
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  updateGiftWrap: async () => {},
  applyCoupon: async (couponCode: string, couponData?: any) => {},
  removeCoupon: () => {},
  totalDiscountlessPrice: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userRole } = useAuth();
  const [cartProducts, setCartProducts] = useState<
    (Product & {
      quantity: number;
      isBundle?: boolean;
      isFreeProduct?: boolean;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cargoPrice, setCargoPrice] = useState(0);
  const [cargoDiscountedPrice, setCargoDiscountedPrice] = useState<
    number | null
  >(null);
  const [minimumCargoAmount, setMinimumCargoAmount] = useState<number | null>(
    null
  );
  const [giftWrapPrice, setGiftWrapPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscountedPrice, setTotalDiscountedPrice] = useState(0);
  const [
    totalProductPhaseDiscountedPrice,
    setTotalProductPhaseDiscountedPrice,
  ] = useState(0);
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftWrapMessage, setGiftWrapMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");
  const [totalDiscountlessPrice, setTotalDiscountlessPrice] = useState(0);
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
  const {
    cart: apiCart,
    isLoading: apiLoading,
    refetchCart,
  } = useGetCart(isGiftWrap, giftWrapMessage, appliedCoupon ? couponCode : "");
  const { addItem, isLoading: addLoading } = useAddToCart(
    isGiftWrap,
    giftWrapMessage,
    appliedCoupon ? couponCode : ""
  );
  const { removeItem, isLoading: removeLoading } = useRemoveFromCart(
    isGiftWrap,
    giftWrapMessage,
    appliedCoupon ? couponCode : ""
  );
  const { updateQuantity: updateApiQuantity, isLoading: updateLoading } =
    useUpdateCartQuantity(
      isGiftWrap,
      giftWrapMessage,
      appliedCoupon ? couponCode : ""
    );
  const { clearCart: clearApiCart, isLoading: clearLoading } = useClearCart(
    isGiftWrap,
    giftWrapMessage,
    appliedCoupon ? couponCode : ""
  );

  // Sepet ürünlerini güncelle (API veya Local'den)
  useEffect(() => {
    if (userRole === UserRole.CUSTOMER && apiCart) {
      // Normal ürünleri ekle
      const normalProducts = apiCart.cartProducts.map((item) => {
        const mappedProduct = {
          ...item.product,
          id: item.productId, // productId'yi id olarak kullan
          quantity: item.quantity,
          isBundle: false,
          isFreeProduct: false,
        };

        return mappedProduct;
      });

      // Bundle'ları "virtual" ürünler olarak ekle
      const bundleProducts = (apiCart.cartBundles || []).map((bundle) =>
        convertBundleToProduct(bundle)
      );

      // Ücretsiz ürün indirimlerini mevcut ürünlere uygula
      const productsWithFreeDiscounts = applyFreeProductDiscounts(
        normalProducts,
        apiCart.cartFreeProducts || []
      );

      // BuyXPayY indirimlerini mevcut ürünlere uygula
      const productsWithAllDiscounts = applyBuyXPayYDiscounts(
        productsWithFreeDiscounts,
        apiCart.cartBuyXPayYs || []
      );

      // Tüm ürünleri birleştir (artık ayrı free products yok)
      const allProducts = [...productsWithAllDiscounts, ...bundleProducts];

      setCartProducts(allProducts);
      setCargoPrice(apiCart.cargoPrice || 0);
      setCargoDiscountedPrice(
        apiCart.cargoDiscountedPrice !== undefined
          ? apiCart.cargoDiscountedPrice
          : null
      );
      setMinimumCargoAmount(
        apiCart.cargoDiscount?.cargoDiscount?.minimumCargoAmount || null
      );
      setGiftWrapPrice(apiCart.giftWrapPrice || 0);
      setTotalPrice(apiCart.totalPrice || 0);
      setTotalProductPhaseDiscountedPrice(
        apiCart.totalProductPhaseDiscountedPrice || 0
      );
      setTotalDiscountedPrice(apiCart.totalDiscountedPrice || 0);
      // Backend'den totalDiscountlessPrice alanı gelmediği için manuel hesapla
      // Ürünlerin indirimli fiyat toplamını hesapla
      const discountedProductTotal = (apiCart.cartProducts || []).reduce(
        (total, item) => {
          const price = item.product.discountedPrice || item.product.price || 0;
          return total + Number(price) * Number(item.quantity);
        },
        0
      );
      setTotalDiscountlessPrice(discountedProductTotal);
      setIsLoading(apiLoading);
    } else {
      setCartProducts(
        localCartProducts.map((p) => ({
          ...p,
          isBundle: false,
          isFreeProduct: false,
        }))
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
      // Quantity kontrolü
      if (quantity <= 0) {
        toast.error("Miktar 0'dan büyük olmalıdır");
        return;
      }

      if (userRole === UserRole.CUSTOMER) {
        // Bundle desteği şu an yok, sadece productId ve quantity gönder
        await addItem(productId, quantity);
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
    if (quantity <= 0) {
      toast.error("Miktar 0'dan büyük olmalıdır");
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

  const handleUpdateGiftWrap = async (
    isGiftWrap: boolean,
    message: string = ""
  ) => {
    try {
      setIsGiftWrap(isGiftWrap);
      setGiftWrapMessage(message);

      // Cart API'sini yenile
      if (userRole === UserRole.CUSTOMER) {
        await refetchCart();
      }

      toast.success("Hediye paketi ayarları güncellendi");
    } catch (error) {
      toast.error("Hediye paketi ayarları güncellenirken bir hata oluştu");
    }
  };

  const handleApplyCoupon = async (couponCode: string, couponData?: any) => {
    try {
      setCouponCode(couponCode);
      setAppliedCoupon(couponData || { code: couponCode, name: couponCode });

      // Cart API'sini yenile
      if (userRole === UserRole.CUSTOMER) {
        await refetchCart();
      }

      toast.success("Kupon kodu uygulandı");
    } catch (error) {
      toast.error("Kupon kodu uygulanırken bir hata oluştu");
    }
  };

  const handleRemoveCoupon = async () => {
    setAppliedCoupon(null);
    setCouponCode("");

    // Cart API'sini yenile
    if (userRole === UserRole.CUSTOMER) {
      await refetchCart();
    }

    toast.success("Kupon kodu kaldırıldı");
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
    minimumCargoAmount,
    giftWrapPrice,
    totalPrice,
    totalProductPhaseDiscountedPrice,
    totalDiscountedPrice,
    isGiftWrap,
    giftWrapMessage,
    appliedCoupon,
    couponCode,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    updateGiftWrap: handleUpdateGiftWrap,
    applyCoupon: handleApplyCoupon,
    removeCoupon: handleRemoveCoupon,
    totalDiscountlessPrice,
    cartDiscount:
      userRole === UserRole.CUSTOMER ? apiCart?.cartDiscount ?? null : null, // <-- EKLE
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
