import { PaginationModel } from "./Pagination";

export enum GeneralContentType {
  // Index_MainCarouselBanner = 1,
  // Index_ShortInfo = 2,

  Index_ShowcaseBanner = 4,
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
  AccordionCargoInfos = 13,
  AccordionOrderAndReturns = 14,
  AccordionPayment = 15,
  AboutName = 16,
  AboutDesign = 18,
  PrivacyPolicy = 19,
  MainSlider = 20,
  SecondSlider = 21,
  MainBanner = 22,
  MainProductList = 23,
  Explore = 25,
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
  [GeneralContentType.Index_ShowcaseBanner]: IsCustomizable.Yes,
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
  [GeneralContentType.AccordionCargoInfos]: IsCustomizable.No,
  [GeneralContentType.AccordionOrderAndReturns]: IsCustomizable.No,
  [GeneralContentType.AccordionPayment]: IsCustomizable.No,
  [GeneralContentType.AboutName]: IsCustomizable.No,
  [GeneralContentType.AboutDesign]: IsCustomizable.No,
  [GeneralContentType.PrivacyPolicy]: IsCustomizable.No,
  [GeneralContentType.MainSlider]: IsCustomizable.No,
  [GeneralContentType.SecondSlider]: IsCustomizable.No,
  [GeneralContentType.MainBanner]: IsCustomizable.No,
  [GeneralContentType.MainProductList]: IsCustomizable.No,
  [GeneralContentType.Explore]: IsCustomizable.No,
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
}

export interface GeneralContentListResponse extends PaginationModel {
  $id: string;
  items: GeneralContentModel[];
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

    case GeneralContentType.Index_ShowcaseBanner:
      return "Ana Sayfa Vitrin Banner";
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
    case GeneralContentType.AccordionCargoInfos:
      return "S.S.S. Kargo Bilgileri";
    case GeneralContentType.AccordionOrderAndReturns:
      return "S.S.S. Sipariş ve İade Bilgileri";
    case GeneralContentType.AccordionPayment:
      return "S.S.S. Ödeme Bilgileri";
    case GeneralContentType.AboutName:
      return "About Name";
    case GeneralContentType.AboutDesign:
      return "About Design";
    case GeneralContentType.PrivacyPolicy:
      return "Gizlilik Politikası";
    case GeneralContentType.MainSlider:
      return "Ana Sayfa Slider";
    case GeneralContentType.SecondSlider:
      return "Ana Sayfa Slider 2";
    case GeneralContentType.MainBanner:
      return "Ana Sayfa Banner";
    case GeneralContentType.MainProductList:
      return "Ana Sayfa Ürün Listesi";
    case GeneralContentType.Explore:
      return "Anasayfa Keşfet";
    default:
      return "Bilinmeyen İçerik Türü";
  }
};
