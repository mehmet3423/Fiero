# Ürün Güncelleme - Kategori ve Alt Kategori Seçimi Ekleme

## Genel Açıklama

Bu dokümantasyon, ürün güncelleme formuna kategori ve alt kategori seçim özelliği ekleme işlemini adım adım açıklar. Ayrıca API request modeline yeni alanların (currencyType, likeCount, saleCount, taxRate) eklenmesi ve güncellenmesi işlemlerini içerir.

## Gereksinimler

- React/Next.js projesi
- TypeScript
- React Query (TanStack Query) veya benzeri state management
- Kategori ve alt kategori için mevcut API hook'ları

## Adım 1: DTO Interface Güncelleme

### Dosya: `src/constants/models/DtoProduct.ts` (veya benzer model dosyası)

**Yapılacaklar:**
- `UpdateDtoProduct` interface'ine yeni alanlar ekle:
  - `currencyType?: number`
  - `likeCount?: number`
  - `saleCount?: number`
  - `taxRate?: number`

**Örnek Kod:**
```typescript
export interface UpdateDtoProduct {
  // ... mevcut alanlar
  price: number;
  sellableQuantity: number;
  barcodeNumber: string;
  // ... diğer alanlar
  subCategoryId: string;
  isAvailable: boolean;
  refundable: boolean;
  isOutlet: boolean;
  
  // Yeni eklenen alanlar
  currencyType?: number;
  likeCount?: number;
  saleCount?: number;
  taxRate?: number;
  
  updateProductInfos?: {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    icon: string;
  }[];
  createProductInfos?: {
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    icon: string;
  }[];
}
```

## Adım 2: Form Component'ine Kategori Seçimi Ekleme

### Dosya: `src/components/admin/products/EditProductForm.tsx` (veya benzer form component)

**Yapılacaklar:**

1. **Gerekli import'ları ekle:**
```typescript
import { useGetMainCategories } from "@/hooks/services/categories/useGetMainCategories";
import { useSubCategoriesByMainCategoryId } from "@/hooks/services/categories/useSubCategoriesByMainCategoryId";
import { useMainCategoriesWithSubCategories } from "@/hooks/services/categories/useMainCategoriesWithSubCategories";
```

2. **State'leri ekle:**
```typescript
// Component içinde
const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string>("");

// Category hooks
const { data: mainCategories, isLoading: isMainCategoriesLoading } = useGetMainCategories();
const { data: subCategories, isLoading: isSubCategoriesLoading } = useSubCategoriesByMainCategoryId(
  selectedMainCategoryId || null
);
const { data: mainCategoriesWithSubs } = useMainCategoriesWithSubCategories();
```

3. **FormData'ya yeni alanları ekle:**
```typescript
const [formData, setFormData] = useState<UpdateDtoProduct>({
  // ... mevcut alanlar
  currencyType: (product as any).currencyType ? Number((product as any).currencyType) : undefined,
  likeCount: (product as any).likeCount || undefined,
  saleCount: (product as any).saleCount || undefined,
  taxRate: (product as any).taxRate || undefined,
});
```

4. **Mevcut kategoriyi bulmak için useEffect ekle:**
```typescript
// Product yüklendiğinde mevcut kategoriyi bul
useEffect(() => {
  if (mainCategoriesWithSubs && mainCategoriesWithSubs.length > 0 && product.subCategoryId) {
    for (const mainCategory of mainCategoriesWithSubs) {
      const foundSubCategory = mainCategory.subCategories.find(
        (sub) => sub.id === product.subCategoryId
      );
      if (foundSubCategory) {
        setSelectedMainCategoryId(mainCategory.id);
        break;
      }
    }
  }
}, [mainCategoriesWithSubs, product.subCategoryId]);
```

5. **Form'a kategori seçim dropdown'larını ekle:**
```tsx
<div className="row">
  <div className="col-md-6">
    <div className="form-group">
      <label>Ana Kategori:</label>
      <select
        className="form-control"
        value={selectedMainCategoryId}
        onChange={(e) => {
          const mainCategoryId = e.target.value;
          setSelectedMainCategoryId(mainCategoryId);
          // Reset subcategory when main category changes
          if (mainCategoryId !== selectedMainCategoryId) {
            setFormData({ ...formData, subCategoryId: "" });
          }
        }}
        disabled={isMainCategoriesLoading}
        required
      >
        <option value="">Kategori Seçin</option>
        {mainCategories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  </div>
  <div className="col-md-6">
    <div className="form-group">
      <label>Alt Kategori:</label>
      <select
        className="form-control"
        value={formData.subCategoryId}
        onChange={(e) =>
          setFormData({ ...formData, subCategoryId: e.target.value })
        }
        disabled={!selectedMainCategoryId || isSubCategoriesLoading}
        required
      >
        <option value="">Alt Kategori Seçin</option>
        {subCategories?.map((subCategory) => (
          <option key={subCategory.id} value={subCategory.id}>
            {subCategory.name}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>
```

6. **TaxRate alanını forma ekle (opsiyonel):**
```tsx
<div className="col-md-3">
  <div className="form-group">
    <label>KDV Oranı (%):</label>
    <input
      type="number"
      className="form-control"
      value={formData.taxRate || 0}
      onChange={(e) =>
        setFormData({
          ...formData,
          taxRate: Number(e.target.value),
        })
      }
      min={0}
      max={100}
    />
  </div>
</div>
```

## Adım 3: Update Hook'unu Güncelleme

### Dosya: `src/hooks/services/products/useUpdateProduct.ts` (veya benzer update hook)

**Yapılacaklar:**

Request body'yi yeni API modeline göre güncelle. API'nin beklediği format camelCase ise:

```typescript
const updateProduct = async (
  productId: string,
  product: UpdateDtoProduct
) => {
  const body: any = {
    id: productId,
    subCategoryId: product.subCategoryId,
    title: product.title,
    description: product.description,
    baseImageUrl: product.baseImageUrl,
    contentImageUrls: product.contentImageUrls || [],
    banner: product.banner || [],
    videoUrl: product.videoUrl || "",
    sellableQuantity: product.sellableQuantity,
    barcodeNumber: product.barcodeNumber,
    price: product.price,
    isAvailable: product.isAvailable,
    isOutlet: product.isOutlet,
    taxRate: product.taxRate || 0,
  };

  // -En alanlarını ekle (varsa)
  if (product.titleEn) {
    body.titleEn = product.titleEn;
  }
  if (product.descriptionEn) {
    body.descriptionEn = product.descriptionEn;
  }
  if (product.baseImageUrlEn) {
    body.baseImageUrlEn = product.baseImageUrlEn;
  }
  if (product.contentImageUrlsEn) {
    body.contentImageUrlsEn = product.contentImageUrlsEn;
  }
  if (product.bannerEn) {
    body.bannerEn = product.bannerEn;
  }
  if (product.videoUrlEn) {
    body.videoUrlEn = product.videoUrlEn;
  }
  
  // Yeni alanlar
  if (product.currencyType !== undefined) {
    body.currencyType = product.currencyType;
  }
  if (product.likeCount !== undefined) {
    body.likeCount = product.likeCount;
  }
  if (product.saleCount !== undefined) {
    body.saleCount = product.saleCount;
  }
  if (product.refundable !== undefined) {
    body.refundable = product.refundable;
  }
  if (product.updateProductInfos && product.updateProductInfos.length > 0) {
    body.updateProductInfos = product.updateProductInfos;
  }
  if (product.createProductInfos && product.createProductInfos.length > 0) {
    body.createProductInfos = product.createProductInfos;
  }

  await mutateAsync(
    {
      url: UPDATE_PRODUCT,
      method: HttpMethod.PUT,
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    },
    {
      onSuccess: () => {
        // Success handling
      },
    }
  );
};
```

**Not:** Eğer API PascalCase bekliyorsa (Id, SubCategoryId, Title, vb.), field isimlerini buna göre güncelleyin.

## Adım 4: Gerekli Hook'ları Kontrol Etme

Aşağıdaki hook'ların projenizde mevcut olduğundan emin olun:

1. `useGetMainCategories` - Ana kategorileri getirir
2. `useSubCategoriesByMainCategoryId` - Seçili ana kategoriye göre alt kategorileri getirir
3. `useMainCategoriesWithSubCategories` - Tüm ana kategorileri alt kategorileriyle birlikte getirir (mevcut kategoriyi bulmak için)

Eğer bu hook'lar yoksa, benzer hook'ları kullanabilir veya oluşturabilirsiniz.

## API Request Model Örneği

Backend'in beklediği request model:

```json
{
  "id": "string (UUID)",
  "subCategoryId": "string (UUID)",
  "title": "string",
  "description": "string",
  "baseImageUrl": "string",
  "contentImageUrls": ["string"],
  "banner": ["string"],
  "videoUrl": "string",
  "titleEn": "string",
  "descriptionEn": "string",
  "baseImageUrlEn": "string",
  "contentImageUrlsEn": ["string"],
  "bannerEn": ["string"],
  "videoUrlEn": "string",
  "sellableQuantity": 0,
  "barcodeNumber": "string",
  "price": 0,
  "isAvailable": true,
  "isOutlet": true,
  "taxRate": 0,
  "currencyType": 0,
  "likeCount": 0,
  "saleCount": 0,
  "refundable": true,
  "updateProductInfos": [
    {
      "id": "string (UUID)",
      "title": "string",
      "description": "string",
      "titleEn": "string",
      "descriptionEn": "string",
      "icon": "string"
    }
  ],
  "createProductInfos": [
    {
      "title": "string",
      "description": "string",
      "titleEn": "string",
      "descriptionEn": "string",
      "icon": "string"
    }
  ]
}
```

## Önemli Notlar

1. **Field Naming Convention:** Backend'in beklediği field isimlendirme formatını (camelCase/PascalCase) kontrol edin ve buna göre request body'yi oluşturun.

2. **Kategori Bağımlılığı:** Ana kategori seçilmeden alt kategori seçilememeli. Bu yüzden alt kategori dropdown'ı `disabled={!selectedMainCategoryId}` ile kontrol edilmeli.

3. **Mevcut Kategoriyi Bulma:** Ürün yüklendiğinde, mevcut `subCategoryId`'ye göre ana kategoriyi otomatik olarak bulmak için `useMainCategoriesWithSubCategories` hook'u kullanılmalı.

4. **State Yönetimi:** Ana kategori değiştiğinde alt kategori state'i sıfırlanmalı.

5. **Loading States:** Kategori verileri yüklenirken dropdown'lar disabled olmalı.

## Test Senaryoları

1. ✅ Ürün yüklendiğinde mevcut kategori ve alt kategori seçili gelmeli
2. ✅ Ana kategori değiştiğinde alt kategori sıfırlanmalı
3. ✅ Alt kategori seçilmeden form submit edilememeli
4. ✅ Yeni alanlar (taxRate, currencyType, vb.) doğru şekilde gönderilmeli
5. ✅ updateProductInfos ve createProductInfos doğru şekilde ayrıştırılmalı

## Prompt Olarak Kullanım

Bu dokümantasyonu başka bir projede kullanmak için:

1. Projenizin dosya yapısına göre path'leri güncelleyin
2. Hook isimlerini projenizdeki mevcut hook'lara göre değiştirin
3. API request formatını (camelCase/PascalCase) backend'inize göre ayarlayın
4. Form component'inizin mevcut yapısına göre UI'ı uyarlayın
