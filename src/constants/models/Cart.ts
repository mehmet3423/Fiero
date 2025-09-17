// import { Product } from "./Product";

import { Product } from "./Product";

// export interface ICart {
//     $id: string;
//     customerId: string;
//     productId: string;
//     cartId: string;
//     customer: ICustomer | null;
//     cartProducts: ICartProductCollection;
//     id: string;
//     createdOn: number;
//     createdOnValue: string;
//     modifiedOn: number | null;
//     modifiedOnValue: string | null;
//     createdBy: string;
//     modifiedBy: string | null;
//     isDeleted: boolean;
//     quantity: number;
// }
// export interface ICartProductCollection {
//     $id: string;
//     $values: Product[]; // İçerideki ürünlerin yapısına göre güncelleyebilirsiniz
// }

// export interface ICustomer {
//     // Örnek:
//     // name: string;
//     // email: string;
// }

export interface CartResponseModel {
  data: {
    $id?: string; // JSON.NET referans ID'si
    customerId: string;
    customer: any | null; // Müşteri objesi null dönüyor; isterseniz kendi interface'inizi yazabilirsiniz.
    cartProducts: CartProduct[];
    cartBundles: CartBundle[];
    cartBuyXPayYs: any[];
    cartFreeProducts: CartFreeProduct[]; // Ücretsiz ürünler
    cargoPrice: number;
    cargoDiscountedPrice: number | null;
    giftWrapPrice: number; // Hediye paketi fiyatı
    couponCode: string | null;
    // Backend'den gerçekten dönen fiyat bilgileri
    totalPrice: number; // Toplam fiyat (kargo dahil)
    totalDiscountedPrice?: number; // İndirimli toplam fiyat (optional - gelmiyor)
    totalProductPhaseDiscountedPrice?: number; // Ürünlerin indirimli fiyat toplamı (kargo hariç)
    totalDiscountlessPrice?: number; // Ürünlerin indirimli fiyat toplamı (kargo hariç)
    couponDiscountId: string | null;
    cartDiscountId: string | null;
    cargoDiscountId: string | null;
    cartDiscount: any | null;
    cargoDiscount: any | null;
    couponDiscount: any | null;
    id: string;
    createdOn: number; // Unix benzeri timestamp
    createdOnValue: string; // Tarih stringi
    modifiedOn: number | null;
    modifiedOnValue: string | null;
    createdBy: string;
    modifiedBy: string | null;
    isDeleted: boolean;
  };
}

export interface CartProduct {
  $id: string; // JSON.NET referans ID'si
  cartId: string;
  cart: { $ref: string }; // Bazı durumlarda sadece { $ref: "1" } dönebiliyor
  productId: string;
  product: Product; // Aynı şekilde ya obje ya referans
  quantity: number;
  id: string;
  createdOn: number;
  createdOnValue: string;
  modifiedOn: number | null;
  modifiedOnValue: string | null;
  createdBy: string;
  modifiedBy: string | null;
  isDeleted: boolean;
  specifiedProductId: string | null;
}

export interface CartBundle {
  bundleId: string;
  bundleDiscount: {
    bundleDiscountProducts: BundleDiscountProduct[];
    bundlePrice: number;
  };
  quantity: number;
  productId: string;
  cartId: string;
  id: string;
  createdOnValue: string;
  modifiedOnValue: string | null;
  isDeleted: boolean;
}

export interface BundleDiscountProduct {
  id: string;
  createdOnValue: string;
  modifiedOnValue: string | null;
  productId: string;
  product: Product | null;
  bundleDiscountId: string;
}

// Ücretsiz ürün modeli
export interface CartFreeProduct {
  // Ortak alanlar
  $id?: string;
  id?: string;
  cartId?: string;
  cart?: { $ref: string };
  isDeleted?: boolean;
  createdOnValue?: string | null;
  modifiedOnValue?: string | null;

  // Kampanya/indirim bağlantısı
  freeProductDiscountId?: string;

  // Eski model: indirim objesi ve içindeki id listesi
  freeProductDiscount?: {
    minimumQuantity?: number;
    maxFreeProductsPerOrder?: number;
    maxFreeProductPrice?: number;
    isRepeatable?: boolean;
    freeProductIds?: string[];
  } | null;

  // Yeni model: freeProductDiscountProducts array'i içindeki her ürün için giftAmount
  freeProductDiscountProducts?: FreeProductDiscountProduct[];

  // Eski model: üst seviyede freeProductIds (her biri 1 adet ücretsiz)
  freeProductIds?: string[];
}

export interface FreeProductDiscountProduct {
  id: string;
  createdOnValue: string;
  modifiedOnValue: string | null;
  productId: string;
  product: Product | null;
  freeProductDiscountId: string;
  giftAmount: number; // Ücretsiz adet sayısı
  quantity: number; // Toplam adet sayısı
}
