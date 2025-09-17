export interface GetShipmentPackagesRequest {
  startDate?: number;        // Belirli bir tarihten sonraki siparişleri getirir. Timestamp (milliseconds) ve GMT +3 olarak gönderilmelidir.
  endDate?: number;          // Belirtilen tarihe kadar olan siparişleri getirir. Timestamp (milliseconds) ve GMT +3 olarak gönderilmelidir.
  page?: number;             // Sadece belirtilen sayfadaki bilgileri döndürür
  size?: number;             // Maksimum 200 - Bir sayfada listelenecek maksimum adeti belirtir
  supplierId?: number;       // İlgili tedarikçinin ID bilgisi gönderilmelidir
  orderNumber?: string;      // Sadece belirli bir sipariş numarası verilerek o siparişin bilgilerini getirir
  status?: string | undefined;           // Created, Picking, Invoiced, Shipped, Cancelled, Delivered, UnDelivered, Returned, AtCollectionPoint, UnPacked, UnSupplied
  orderByField?: string;     // PackageLastModifiedDate - Son güncellenme tarihini baz alır
  orderByDirection?: "ASC" | "DESC" | null; // ASC (Eskiden yeniye) veya DESC (Yeniden eskiye)
  shipmentPackageIds?: number[]; // Paket numarasıyla sorgu atılır
}

export interface ShipmentAddress {
  /** Alıcının adı */
  firstName: string;
  /** Alıcının soyadı */
  lastName: string;
  /** Adresin şehir bilgisi */
  city: string;
  /** İlçe bilgisi */
  district: string;
  /** Mahalle ID bilgisi */
  neighborhoodId: number;
  /** Açık adres bilgisi */
  fullAddress: string;
  /** Ülke kodu (örn: TR) */
  countryCode: string;
  /** Posta kodu */
  postalCode: string;
  /** Enlem bilgisi */
  latitude: string;
  /** Boylam bilgisi */
  longitude: string;
  /** Adres ID'si */
  id: number;
  /** Şirket adı */
  company: string;
  /** Adres satırı 1 */
  address1: string;
  /** Adres satırı 2 */
  address2: string;
  /** Şehir kodu */
  cityCode: number;
  /** İlçe ID'si */
  districtId: number;
  /** İl ID'si */
  countyId: number;
  /** İl adı */
  countyName: string;
  /** Kısa adres */
  shortAddress: string;
  /** Eyalet adı */
  stateName: string;
  /** Adres satırları */
  addressLines: AddressLines;
  /** Mahalle adı */
  neighborhood: string;
  /** Telefon numarası */
  phone: string;
  /** Tam ad (ad + soyad) */
  fullName: string;
}

export interface InvoiceAddress {
  /** Fatura adresi ID'si */
  id: number;
  /** Alıcının adı */
  firstName: string;
  /** Alıcının soyadı */
  lastName: string;
  /** Firma adı (kurumsal siparişlerde) */
  company: string;
  /** Adresin ilk satırı */
  address1: string;
  /** Adresin ikinci satırı */
  address2: string;
  /** Şehir adı */
  city: string;
  /** Şehir kodu */
  cityCode: number;
  /** İlçe adı */
  district: string;
  /** İlçe ID'si */
  districtId: number;
  /** İl (county) ID'si */
  countyId: number;
  /** İl (county) adı */
  countyName: string;
  /** Kısa adres açıklaması */
  shortAddress: string;
  /** Eyalet / bölge adı (varsa) */
  stateName: string;
  /** Adres satırlarını içeren nesne */
  addressLines: AddressLines;
  /** Posta kodu */
  postalCode: string;
  /** Ülke kodu (örn: TR) */
  countryCode: string;
  /** Mahalle ID'si */
  neighborhoodId: number;
  /** Mahalle adı */
  neighborhood: string;
  /** Telefon numarası */
  phone: string;
  /** Enlem bilgisi */
  latitude: string;
  /** Boylam bilgisi */
  longitude: string;
  /** Tam adres metni */
  fullAddress: string;
  /** Tam ad (ad + soyad) */
  fullName: string;
  /** Vergi dairesi adı */
  taxOffice: string;
  /** Vergi numarası */
  taxNumber: string;
  /** E-fatura mükellefi mi? */
  eInvoiceAvailable?: boolean; // Backend'den eklendi
}

export interface ShipmentLine {
  /** Ürün barkodu */
  barcode: string;
  /** Ürün adı */
  productName: string;
  /** Ürün adedi */
  quantity: number;
  /** Ürünün toplam fiyatı */
  price: number;
  /** Ürünün indirimsiz fiyatı */
  amount: number;
  /** İndirim tutarı */
  discount: number;
  /** Ürün boyutu */
  productSize: string;
  /** Ürün rengi */
  productColor: string;
  /** Ürüne ait SKU (merchantSku) */
  merchantSku: string;
  /** Ürünün kampanya ID'si (varsa) */
  salesCampaignId?: number;
  /** Ürün kodu */
  productCode: number;
  /** Satıcı ID'si */
  merchantId: number;
  /** Trendyol tarafından yapılan indirim tutarı */
  tyDiscount: number;
  /** İndirim detayları */
  discountDetails: DiscountDetail[];
  /** Para birimi kodu */
  currencyCode: string;
  /** Satır ID'si. (orderLineId) */
  id: number; // Backend'de bu field orderLineId rolünü üstleniyor
  /** Ürün menşei bilgisi (mikro ihracat için) */
  productOrigin?: string; // Backend'den eklendi
  /** İşçilik maliyeti */
  laborCost?: number; // Backend'den eklendi
  /** SKU kodu */
  sku: string;
  /** KDV matrahı tutarı */
  vatBaseAmount: number;
  /** Sipariş satırı öğesi durum adı */
  orderLineItemStatusName: string;
  /** Hızlı teslimat seçenekleri */
  fastDeliveryOptions: any[];
  /** Ürün kategori ID'si */
  productCategoryId: number;
}

export interface ShipmentPackage {
  /** Sipariş paketi ID (shipmentPackageId) */
  id: number;
  /** Sipariş numarası (orderNumber) */
  orderNumber: string;
  /** Siparişin brüt tutarı */
  grossAmount: number;
  /** Toplam indirim tutarı */
  totalDiscount: number;
  /** Trendyol tarafından yapılan toplam indirim tutarı */
  totalTyDiscount: number;
  /** Siparişin toplam ödenecek fiyatı */
  totalPrice: number;
  /** Siparişin güncel statüsü (Created, Shipped, Delivered vb.) */
  status: string;
  /** Paket statüsünün en son güncellenme zamanı (timestamp - milliseconds) */
  lastModifiedDate: number;
  /** Sipariş tarihi (timestamp - milliseconds) */
  orderDate: number;
  /** Kabul edilen teslimat tarihi (timestamp - milliseconds) */
  agreedDeliveryDate?: number;
  /** Sipariş kurumsal faturalı mı? */
  commercial: boolean;
  /** Teslimat adresi bilgisi */
  shipmentAddress: ShipmentAddress;
  /** Fatura adresi bilgisi */
  invoiceAddress: InvoiceAddress;
  /** Siparişe ait ürün satırları */
  lines: ShipmentLine[];
  /** Kargo takip numarası */
  cargoTrackingNumber?: string;
  /** Kargo takip linki */
  cargoTrackingLink?: string;
  /** Kargo gönderici numarası */
  cargoSenderNumber?: string; // Backend'den eklendi
  /** Kargo firması adı */
  cargoProviderName?: string;
  /** Vergi numarası */
  taxNumber: string;
  /** Müşteri adı */
  customerFirstName: string;
  /** Müşteri e-posta adresi */
  customerEmail: string;
  /** Müşteri ID'si */
  customerId: number;
  /** Müşteri soyadı */
  customerLastName: string;
  /** Kimlik numarası */
  identityNumber: string;
  /** Para birimi kodu (örn: TRY) */
  currencyCode: string;
  /** Paket geçmişi */
  packageHistories: PackageHistory[];
  /** Kargo paketi durumu */
  shipmentPackageStatus: string;
  /** Teslimat türü */
  deliveryType: string;
  /** Zaman aralığı ID'si */
  timeSlotId: number;
  /** Planlanan teslimat mağaza ID'si */
  scheduledDeliveryStoreId?: string; // Backend'den eklendi
  /** Tahmini teslimat başlangıç tarihi (timestamp - milliseconds) */
  estimatedDeliveryStartDate: number;
  /** Tahmini teslimat bitiş tarihi (timestamp - milliseconds) */
  estimatedDeliveryEndDate: number;
  /** Teslimat adres türü */
  deliveryAddressType: string;
  /** Hızlı teslimat durumu */
  fastDelivery: boolean;
  /** Orijinal kargo tarihi (timestamp - milliseconds) */
  originShipmentDate: number;
  /** Hızlı teslimat türü */
  fastDeliveryType: string;
  /** Servis tarafından teslim edildi mi? */
  deliveredByService: boolean;
  /** Kabul edilen teslimat tarihi genişletilebilir mi? */
  agreedDeliveryDateExtendible: boolean;
  /** Genişletilmiş kabul edilen teslimat tarihi (timestamp - milliseconds) */
  extendedAgreedDeliveryDate: number;
  /** Kabul edilen teslimat genişletme bitiş tarihi (timestamp - milliseconds) */
  agreedDeliveryExtensionEndDate: number;
  /** Kabul edilen teslimat genişletme başlangıç tarihi (timestamp - milliseconds) */
  agreedDeliveryExtensionStartDate: number;
  /** Fatura linki */
  invoiceLink?: string; // Backend'den eklendi
  /** Depo ID'si */
  warehouseId: number;
  /** Grup anlaşması durumu */
  groupDeal: boolean;
  /** Mikro sipariş durumu */
  micro: boolean;
  /** ETGB numarası (mikro ihracat siparişleri için) */
  etgbNo?: string; // Backend'den eklendi
  /** ETGB tarihi (mikro ihracat siparişleri için - timestamp - milliseconds) */
  etgbDate?: number; // Backend'den eklendi
  /** Hediye kutusu talep edildi mi? */
  giftBoxRequested: boolean;
  /** Trendyol tarafından 3. parti teslimat durumu */
  '3pByTrendyol': boolean;
  /** Tehlikeli ürün içeriyor mu? */
  containsDangerousProduct: boolean;
  /** Kargo desi bilgisi */
  cargoDeci?: number; // Backend'den eklendi
  /** Kapıda ödeme durumu */
  isCod: boolean;
  /** Oluşturan kullanıcı/sistem */
  createdBy: string;
  /** Orijinal paket ID'leri - bölünmüş paketler için */
  originPackageIds?: number[];
}

export interface AddressLines {
  /** Adres satırı 1 */
  addressLine1: string;
  /** Adres satırı 2 */
  addressLine2: string;
}

export interface DiscountDetail {
  /** Satır öğesi fiyatı */
  lineItemPrice: number;
  /** Satır öğesi indirimi */
  lineItemDiscount: number;
  /** Satır öğesi Trendyol indirimi */
  lineItemTyDiscount: number;
}

export interface PackageHistory {
  /** Oluşturulma tarihi (timestamp - milliseconds) */
  createdDate: number;
  /** Durum bilgisi */
  status: string;
}

export interface GetShipmentPackagesResponse {
  /** Dönülen sayfa numarası */
  page: number;
  /** Sayfa başına kaç kayıt döndüğü bilgisi */
  size: number;
  /** Toplam sayfa sayısı */
  totalPages: number;
  /** Toplam kayıt sayısı */
  totalElements: number;
  /** Sipariş paketlerine ait liste */
  content: ShipmentPackage[];
}