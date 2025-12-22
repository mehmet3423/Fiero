import { PaginationModel } from "./Pagination";

export enum ContentLanguage {
  TR = 0,
  EN = 1,
}

export const getContentLanguageName = (language: ContentLanguage): string => {
  switch (language) {
    case ContentLanguage.TR:
      return "Türkçe";
    case ContentLanguage.EN:
      return "İngilizce";
    default:
      return "Bilinmeyen";
  }
};

export enum GeneralContentType {
  // Index_MainCarouselBanner = 1,
  // Index_ShortInfo = 2,

  // Index_Default = 5,

  // Index_Categories = 4,
  // Header_Products = 5,
  // Footer_Information = 6,
  // Footer_Institutional = 7,
  // Footer_MainCategories = 8,
  // AboutUs = 9,
  // Contact = 10,
  // PrivacyPolicy = 11,
  // TermsOfUse = 12
  Explore = 13,
  AccordionCargoInfos = 26,
  MainSlider = 20,
  MainBanner = 22,
  MainProductList = 23,
  CookiePolicies = 24,
  DistanceSalesAgreement = 25,
  Policies = 27,
  WarrantyAndReturnPolicies = 28,
  PrivacyAndPaymentSecurity = 29,
  AboutUsContent = 30,
  OurStoryContent = 31,
  PrivacyAndCookiesCombined = 32,
  DeliveryTerms = 33,
  MembershipAndUsageTerms = 34,
  BlogPosts = 35,
  ShopCollection = 36,
  IconBoxModern = 37,
}
// enum extends bak heposi aynı tşip sayıları farklı olcak
// conternt url tıklaynca gitceği yer
// content url e id koyup sonradan navigationa koyabilirsin id ile birlikte
//admin paneldeki layout kısmını genişliğini küçült ki ana sayfada layout bozulmasın
export enum IsCustomizable {
  Yes = 1,
  No = 0,
}

// Her content type için customizable ayarları
export const CONTENT_CUSTOMIZATION_SETTINGS: Record<
  GeneralContentType,
  IsCustomizable
> = {
  // [GeneralContentType.Index_MainCarouselBanner]: IsCustomizable.No,
  // [GeneralContentType.Index_ShortInfo]: IsCustomizable.No,
  // [GeneralContentType.Index_Default]: IsCustomizable.No,

  // [GeneralContentType.Index_Categories]: IsCustomizable.No,
  // [GeneralContentType.Header_Products]: IsCustomizable.No,
  // [GeneralContentType.Footer_Information]: IsCustomizable.No,
  // [GeneralContentType.Footer_Institutional]: IsCustomizable.No,
  // [GeneralContentType.Footer_MainCategories]: IsCustomizable.No,
  // [GeneralContentType.AboutUs]: IsCustomizable.No,
  // [GeneralContentType.Contact]: IsCustomizable.No,
  // [GeneralContentType.PrivacyPolicy]: IsCustomizable.No,
  // [GeneralContentType.TermsOfUse]: IsCustomizable.No,
  [GeneralContentType.Explore]: IsCustomizable.No,
  [GeneralContentType.AccordionCargoInfos]: IsCustomizable.No,
  [GeneralContentType.MainSlider]: IsCustomizable.No,
  [GeneralContentType.MainBanner]: IsCustomizable.No,
  [GeneralContentType.MainProductList]: IsCustomizable.No,
  [GeneralContentType.DistanceSalesAgreement]: IsCustomizable.No,
  [GeneralContentType.CookiePolicies]: IsCustomizable.No,
  [GeneralContentType.Policies]: IsCustomizable.No,
  [GeneralContentType.WarrantyAndReturnPolicies]: IsCustomizable.No,
  [GeneralContentType.PrivacyAndPaymentSecurity]: IsCustomizable.No,
  [GeneralContentType.AboutUsContent]: IsCustomizable.No,
  [GeneralContentType.OurStoryContent]: IsCustomizable.No,
  [GeneralContentType.PrivacyAndCookiesCombined]: IsCustomizable.No,
  [GeneralContentType.DeliveryTerms]: IsCustomizable.No,
  [GeneralContentType.MembershipAndUsageTerms]: IsCustomizable.No,
  [GeneralContentType.BlogPosts]: IsCustomizable.No,
  [GeneralContentType.ShopCollection]: IsCustomizable.No,
  [GeneralContentType.IconBoxModern]: IsCustomizable.No,
};

// Helper function to check if a content type is customizable
export const isContentTypeCustomizable = (
  contentType: GeneralContentType
): boolean => {
  return CONTENT_CUSTOMIZATION_SETTINGS[contentType] === IsCustomizable.Yes;
};

export interface GeneralContentModel {
  $id: string;
  id: string;
  order: number; // integer($int32)
  title?: string; // nullable: true
  content?: string; // nullable: true
  contentUrl?: string; // nullable: true
  imageUrl?: string; // nullable: true
  willRender: boolean;
  generalContentType: GeneralContentType; // Enum
  language?: ContentLanguage; // nullable: true
}

export interface GeneralContentListResponse extends PaginationModel {
  $id: string;
  items: GeneralContentModel[];
}

export interface GeneralContentApiResponse {
  data: GeneralContentModel[];
  isSucceed: boolean;
  message: string;
}

export interface LayoutItem {
  w: number;
  h: number;
  x: number;
  y: number;
  i: string; // Widget ID'si
  moved: boolean;
  static: boolean;
}

export interface LayoutConfig {
  lg?: LayoutItem[];
  md?: LayoutItem[];
  sm?: LayoutItem[];
  xs?: LayoutItem[];
  [key: string]: LayoutItem[] | undefined;
}

// GeneralContentType enum'ının Türkçe karşılıklarını veren fonksiyon
export const getGeneralContentTypeName = (
  contentType: GeneralContentType
): string => {
  switch (contentType) {
    // case GeneralContentType.Index_MainCarouselBanner:
    //     return "Ana Sayfa Carousel Banner";
    // case GeneralContentType.Index_ShortInfo:
    //     return "Ana Sayfa Kısa Bilgi";

    // case GeneralContentType.Index_Default:
    // return "Yapım Aşamasında..";
    // case GeneralContentType.Index_Categories:
    //     return "Ana Sayfa Kategoriler";
    // case GeneralContentType.Header_Products:
    //     return "Üst Menü Ürünler";
    // case GeneralContentType.Footer_Information:
    //     return "Alt Menü Bilgilendirme";
    // case GeneralContentType.Footer_Institutional:
    //     return "Alt Menü Kurumsal";
    // case GeneralContentType.Footer_MainCategories:
    //     return "Alt Menü Ana Kategoriler";
    // case GeneralContentType.AboutUs:
    //     return "Hakkımızda";
    // case GeneralContentType.Contact:
    //     return "İletişim";
    // case GeneralContentType.PrivacyPolicy:
    //     return "Gizlilik Politikası";
    // case GeneralContentType.TermsOfUse:
    //     return "Kullanım Koşulları";
    case GeneralContentType.Explore:
      return "Müşteri Yorumları (Testimonial)";
    case GeneralContentType.AccordionCargoInfos:
      return "S.S.S. Kargo Bilgileri";
    case GeneralContentType.MainSlider:
      return "Ana Sayfa Slider";
    case GeneralContentType.MainBanner:
      return "Ana Sayfa Banner";
    case GeneralContentType.MainProductList:
      return "Ana Sayfa Ürün Listesi";
    case GeneralContentType.DistanceSalesAgreement:
      return "Satış Sözleşmesi";
    case GeneralContentType.CookiePolicies:
      return "Çerez Politikaları";
    case GeneralContentType.Policies:
      return "Politikalar ve Belgeler";
    case GeneralContentType.WarrantyAndReturnPolicies:
      return "Garanti ve İade Koşulları";
    case GeneralContentType.PrivacyAndPaymentSecurity:
      return "Gizlilik ve Ödeme Güvenliği";
    case GeneralContentType.AboutUsContent:
      return "Hakkımızda İçeriği";
    case GeneralContentType.OurStoryContent:
      return "Hikayemiz";
    case GeneralContentType.PrivacyAndCookiesCombined:
      return "KVKK ve Çerez Politikası";
    case GeneralContentType.DeliveryTerms:
      return "Teslimat Koşulları";
    case GeneralContentType.MembershipAndUsageTerms:
      return "Üyelik ve Kullanım Şartları";
    case GeneralContentType.BlogPosts:
      return "Blog Yazıları";
    case GeneralContentType.ShopCollection:
      return "Mağaza Koleksiyonu";
    case GeneralContentType.IconBoxModern:
      return "Icon Box Modern";
    default:
      return "Bilinmeyen İçerik Türü";
  }
};
