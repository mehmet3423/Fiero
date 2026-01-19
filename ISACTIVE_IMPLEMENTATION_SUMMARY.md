# isActive Alanı ve GetActiveMainCategoriesList Entegrasyonu - Detaylı Dokümantasyon

## Genel Bakış

Bu dokümantasyon, admin panelinde kategori yönetimi için `isActive` alanının eklenmesi ve kullanıcı tarafında sadece aktif kategorileri listeleyen yeni bir endpoint'in entegrasyonunu açıklar.

## Yapılan İşlemler Özeti

1. **Endpoint Eklendi**: `GET_ACTIVE_MAIN_CATEGORY_LIST` endpoint'i `src/constants/links.ts` dosyasına eklendi.
2. **Yeni Hook Oluşturuldu**: Kullanıcı tarafı için `useActiveCategories` hook'u oluşturuldu ve `GetActiveMainCategoriesList` endpoint'ini kullanıyor.
3. **QueryKey Eklendi**: `ACTIVE_MAIN_CATEGORY_LIST` query key'i `src/constants/enums/QueryKeys.ts` dosyasına eklendi.
4. **Kullanıcı Tarafı Güncellendi**: `MobileMenu.tsx` ve `products/index.tsx` dosyalarında `useCategories` yerine `useActiveCategories` kullanıldı.
5. **Model Güncellemeleri**: `Category` ve `SubCategory` modellerine `isActive?: boolean` alanı eklendi.
6. **MainCategory Create Modal**: Yeni ana kategori oluşturma modal'ına isActive checkbox'ı eklendi.
7. **MainCategory Update Modal**: Ana kategori düzenleme modal'ına isActive checkbox'ı eklendi.
8. **SubCategory Create Modal**: Yeni alt kategori oluşturma modal'ına isActive checkbox'ı eklendi.
9. **SubCategory Update Modal**: Alt kategori düzenleme modal'ına isActive checkbox'ı eklendi.
10. **useCreateMainCategory Hook**: Hook'a `isActive` parametresi eklendi ve query parametresi olarak gönderiliyor.
11. **useUpdateMainCategory Hook**: Hook'a `isActive` parametresi eklendi ve query parametresi olarak gönderiliyor.
12. **useCreateSubCategory Hook**: Hook'a `isActive` parametresi eklendi ve request body'ye ekleniyor.
13. **useUpdateSubCategory Hook**: Hook'a `isActive` parametresi eklendi ve request body'ye ekleniyor.
14. **UI İyileştirmesi**: Modallardaki "Aktif" label'larına `text-dark` class'ı eklendi.

## Detaylı Açıklamalar

### 1. Endpoint Tanımlaması

**Dosya**: `src/constants/links.ts`

```typescript
export const GET_ACTIVE_MAIN_CATEGORY_LIST = `${BASE_URL}api/MainCategory/GetActiveMainCategoriesList`;
```

Bu endpoint, sadece aktif ana kategorileri döndürür ve kullanıcı tarafında kullanılır. Admin panelinde hala `GetMainCategoriesList` kullanılmaya devam eder.

**Query Parametreleri**:
- `Name` (string, optional): Kategori adına göre filtreleme
- `Page` (integer, optional): Sayfa numarası
- `PageSize` (integer, optional): Sayfa başına kayıt sayısı
- `From` (integer, optional): Başlangıç indeksi

### 2. Yeni Hook: useActiveCategories

**Dosya**: `src/hooks/services/categories/useActiveCategories.ts`

```typescript
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ACTIVE_MAIN_CATEGORY_LIST } from "@/constants/links";
import { CategoryListResponse } from "@/constants/models/Category";
import useGetData from "@/hooks/useGetData";

export const useActiveCategories = () => {
  const { data, isLoading, error } = useGetData<{ data: CategoryListResponse }>(
    {
      url: GET_ACTIVE_MAIN_CATEGORY_LIST,
      queryKey: QueryKeys.ACTIVE_MAIN_CATEGORY_LIST,
      method: HttpMethod.GET,
      onError(err) {
      },
    }
  );

  return {
    categories: data?.data,
    isLoading,
    error,
  };
};
```

Bu hook, sadece aktif kategorileri getirmek için kullanılır ve kullanıcı tarafında (frontend/public) kullanılmalıdır.

### 3. QueryKey Eklendi

**Dosya**: `src/constants/enums/QueryKeys.ts`

```typescript
ACTIVE_MAIN_CATEGORY_LIST = "ActiveMainCategoryList",
```

React Query cache yönetimi için gerekli key eklendi.

### 4. Kullanıcı Tarafı Güncellemeleri

#### MobileMenu.tsx
```typescript
// Önce
import { useCategories } from "@/hooks/services/categories/useCategories";
const { categories } = useCategories();

// Sonra
import { useActiveCategories } from "@/hooks/services/categories/useActiveCategories";
const { categories } = useActiveCategories();
```

#### products/index.tsx
```typescript
// Önce
import { useCategories } from "@/hooks/services/categories/useCategories";
const { categories, isLoading: categoriesLoading } = useCategories();

// Sonra
import { useActiveCategories } from "@/hooks/services/categories/useActiveCategories";
const { categories, isLoading: categoriesLoading } = useActiveCategories();
```

### 5. Model Güncellemeleri

**Dosya**: `src/constants/models/Category.ts`

```typescript
export interface Category {
  // ... mevcut alanlar
  isActive?: boolean; // Yeni eklendi
}

export interface SubCategory {
  // ... mevcut alanlar
  isActive?: boolean; // Yeni eklendi
}
```

### 6. Admin Panel - MainCategory Create Modal

**Dosya**: `src/pages/admin/categories/index.tsx`

**State Eklendi**:
```typescript
const [newMainCategoryIsActive, setNewMainCategoryIsActive] = useState<boolean>(true);
```

**Modal İçeriği**:
```tsx
<div className="mt-3">
  <div className="form-check form-switch">
    <input
      className="form-check-input"
      type="checkbox"
      id="newMainCategoryIsActive"
      checked={newMainCategoryIsActive}
      onChange={(e) => setNewMainCategoryIsActive(e.target.checked)}
    />
    <label className="form-check-label text-dark" htmlFor="newMainCategoryIsActive">
      Aktif
    </label>
  </div>
</div>
```

**Handler Güncellemesi**:
```typescript
await createMainCategory(
  newMainCategoryName,
  newMainCategoryNameEn || undefined,
  index,
  imageUrl || "",
  newMainCategoryIsActive // Yeni eklendi
);
```

### 7. Admin Panel - MainCategory Update Modal

**Modal İçeriği**:
```tsx
<div className="mt-3">
  <div className="form-check form-switch">
    <input
      className="form-check-input"
      type="checkbox"
      id="editMainCategoryIsActive"
      checked={editingMainCategory?.isActive ?? true}
      onChange={(e) =>
        setEditingMainCategory((prev) =>
          prev ? { ...prev, isActive: e.target.checked } : null
        )
      }
    />
    <label className="form-check-label text-dark" htmlFor="editMainCategoryIsActive">
      Aktif
    </label>
  </div>
</div>
```

**Handler Güncellemesi**:
```typescript
await updateMainCategory(
  editingMainCategory.id,
  editingMainCategory.name,
  editingMainCategory.displayIndex,
  imageUrl ?? undefined,
  editingMainCategory.nameEn || undefined,
  editingMainCategory.isActive // Yeni eklendi
);
```

### 8. Admin Panel - SubCategory Create Modal

**State Eklendi**:
```typescript
const [newSubCategoryIsActive, setNewSubCategoryIsActive] = useState<boolean>(true);
```

**Modal İçeriği**:
```tsx
<div className="mt-3">
  <div className="form-check form-switch">
    <input
      className="form-check-input"
      type="checkbox"
      id="newSubCategoryIsActive"
      checked={newSubCategoryIsActive}
      onChange={(e) => setNewSubCategoryIsActive(e.target.checked)}
    />
    <label className="form-check-label text-dark" htmlFor="newSubCategoryIsActive">
      Aktif
    </label>
  </div>
</div>
```

**Handler Güncellemesi**:
```typescript
await createSubCategory(
  newSubCategoryName,
  selectedMainCategory.id,
  newSubCategoryNameEn || undefined,
  imageUrl,
  newSubCategoryIsActive // Yeni eklendi
);
```

### 9. Admin Panel - SubCategory Update Modal

**State Güncellemesi**:
```typescript
const [editingSubCategory, setEditingSubCategory] = useState<{
  id: string;
  name: string;
  nameEn?: string | null;
  mainCategoryId: string;
  displayIndex: number;
  imageUrl?: string;
  isActive?: boolean; // Yeni eklendi
} | null>(null);
```

**Modal İçeriği**:
```tsx
<div className="mt-3">
  <div className="form-check form-switch">
    <input
      className="form-check-input"
      type="checkbox"
      id="editSubCategoryIsActive"
      checked={editingSubCategory?.isActive ?? true}
      onChange={(e) =>
        setEditingSubCategory((prev) =>
          prev ? { ...prev, isActive: e.target.checked } : null
        )
      }
    />
    <label className="form-check-label text-dark" htmlFor="editSubCategoryIsActive">
      Aktif
    </label>
  </div>
</div>
```

**Handler Güncellemesi**:
```typescript
await updateSubCategory(
  editingSubCategory.id,
  editingSubCategory.name,
  editingSubCategory.displayIndex,
  imageUrl,
  editingSubCategory.nameEn || undefined,
  editingSubCategory.isActive // Yeni eklendi
);
```

### 10. useCreateMainCategory Hook Güncellemesi

**Dosya**: `src/hooks/services/categories/useCreateMainCategory.ts`

```typescript
const createMainCategory = async (
  name: string,
  nameEn?: string,
  displayIndex?: number,
  imageUrl?: string,
  isActive?: boolean // Yeni eklendi
) => {
  try {
    const params = new URLSearchParams();
    params.append("Name", name);

    if (nameEn) {
      params.append("NameEn", nameEn);
    }

    if (displayIndex !== undefined) {
      params.append("DisplayIndex", displayIndex.toString());
    }

    if (imageUrl) {
      params.append("ImageUrl", imageUrl);
    }

    if (isActive !== undefined) {
      params.append("IsActive", isActive.toString()); // Yeni eklendi
    }

    await mutateAsync(
      {
        url: `${CREATE_MAIN_CATEGORY}?${params.toString()}`,
        method: HttpMethod.POST,
      },
      // ...
    );
  }
};
```

**API Formatı**: Query parametresi olarak `IsActive` (boolean, optional)

### 11. useUpdateMainCategory Hook Güncellemesi

**Dosya**: `src/hooks/services/categories/useUpdateMainCategory.ts`

```typescript
const updateMainCategory = async (
  id: string,
  name: string,
  displayIndex: number,
  imageUrl?: string,
  nameEn?: string,
  isActive?: boolean // Yeni eklendi
) => {
  try {
    const params = new URLSearchParams();
    params.append("Id", id);
    params.append("Name", name);
    params.append("DisplayIndex", displayIndex.toString());

    if (imageUrl) {
      params.append("ImageUrl", imageUrl);
    }

    if (nameEn) {
      params.append("NameEn", nameEn);
    }

    if (isActive !== undefined) {
      params.append("IsActive", isActive.toString()); // Yeni eklendi
    }

    await mutateAsync(
      {
        url: `${UPDATE_MAIN_CATEGORY}?${params.toString()}`,
        method: HttpMethod.PUT,
      },
      // ...
    );
  }
};
```

**API Formatı**: Query parametresi olarak `IsActive` (boolean, optional)

### 12. useCreateSubCategory Hook Güncellemesi

**Dosya**: `src/hooks/services/categories/useCreateSubCategory.ts`

```typescript
const createSubCategory = async (
  name: string,
  mainCategoryId: string,
  nameEn?: string,
  imageUrl?: string,
  isActive?: boolean // Yeni eklendi
) => {
  try {
    await mutateAsync(
      {
        url: `${CREATE_SUB_CATEGORY}`,
        data: {
          mainCategoryId: mainCategoryId,
          name: name,
          nameEn: nameEn,
          imageUrl: imageUrl || "",
          isActive: isActive !== undefined ? isActive : true, // Yeni eklendi
          createSEORequest: {
            slug: "string",
            metaTitle: "string",
            metaDescription: "string",
            robotsMetaTag: "string",
          },
          createSubCategorySpecificationDTO: [],
        },
        method: HttpMethod.POST,
      },
      // ...
    );
  }
};
```

**API Formatı**: Request body'de `isActive` (boolean, default: true)

### 13. useUpdateSubCategory Hook Güncellemesi

**Dosya**: `src/hooks/services/categories/useUpdateSubCategory.ts`

```typescript
const updateSubCategory = async (
  id: string,
  name: string,
  displayIndex: number,
  imageUrl?: string,
  nameEn?: string,
  isActive?: boolean // Yeni eklendi
) => {
  try {
    const requestBody: {
      id: string;
      name: string;
      nameEn?: string;
      displayIndex: number;
      imageUrl?: string;
      isActive?: boolean; // Yeni eklendi
    } = {
      id: id,
      name: name,
      displayIndex: displayIndex,
    };

    if (nameEn) {
      requestBody.nameEn = nameEn;
    }

    if (imageUrl) {
      requestBody.imageUrl = imageUrl;
    }

    if (isActive !== undefined) {
      requestBody.isActive = isActive; // Yeni eklendi
    }

    await mutateAsync(
      {
        url: UPDATE_SUB_CATEGORY,
        method: HttpMethod.PUT,
        data: requestBody,
      },
      // ...
    );
  }
};
```

**API Formatı**: Request body'de `isActive` (boolean, optional)

## API Endpoint Özeti

### MainCategory Endpoints

#### Create MainCategory
- **Method**: POST
- **Endpoint**: `/api/MainCategory/CreateMainCategory`
- **Parameters**: Query parameters
  - `Name` (required, string)
  - `NameEn` (optional, string)
  - `DisplayIndex` (optional, integer)
  - `ImageUrl` (optional, string)
  - `IsActive` (optional, boolean) - **YENİ**

#### Update MainCategory
- **Method**: PUT
- **Endpoint**: `/api/MainCategory/UpdateMainCategory`
- **Parameters**: Query parameters
  - `Id` (required, string/UUID)
  - `Name` (required, string)
  - `DisplayIndex` (required, integer)
  - `NameEn` (optional, string)
  - `ImageUrl` (optional, string)
  - `IsActive` (optional, boolean) - **YENİ**

### SubCategory Endpoints

#### Create SubCategory
- **Method**: POST
- **Endpoint**: `/api/SubCategory/CreateSubCategory`
- **Body**: JSON
  ```json
  {
    "mainCategoryId": "string",
    "name": "string",
    "nameEn": "string",
    "isActive": true,  // YENİ
    "displayIndex": 0,
    "imageUrl": "string",
    "createSubCategorySpecificationDTO": [],
    "createSEORequest": { ... }
  }
  ```

#### Update SubCategory
- **Method**: PUT
- **Endpoint**: `/api/SubCategory/UpdateSubCategory`
- **Body**: JSON
  ```json
  {
    "id": "string",
    "name": "string",
    "nameEn": "string",
    "isActive": true,  // YENİ
    "displayIndex": 0,
    "imageUrl": "string"
  }
  ```

### List Endpoints

#### Get Active Main Categories (Kullanıcı Tarafı)
- **Method**: GET
- **Endpoint**: `/api/MainCategory/GetActiveMainCategoriesList`
- **Query Parameters**:
  - `Name` (optional, string)
  - `Page` (optional, integer)
  - `PageSize` (optional, integer)
  - `From` (optional, integer)
- **Kullanım**: Sadece aktif kategorileri döndürür, kullanıcı tarafında kullanılır

#### Get Main Categories (Admin Panel)
- **Method**: GET
- **Endpoint**: `/api/MainCategory/GetMainCategoriesList`
- **Kullanım**: Tüm kategorileri döndürür (aktif/pasif), admin panelinde kullanılır

## Önemli Notlar

1. **Endpoint Ayrımı**: 
   - Kullanıcı tarafı: `GetActiveMainCategoriesList` kullanır (sadece aktif kategoriler)
   - Admin paneli: `GetMainCategoriesList` kullanır (tüm kategoriler)

2. **Default Değerler**:
   - Yeni oluşturulan kategoriler için `isActive` varsayılan olarak `true` olarak ayarlanır
   - Update işlemlerinde mevcut değer korunur, yoksa `true` kullanılır

3. **API Format Farkları**:
   - MainCategory: `isActive` query parametresi olarak gönderilir (`IsActive`)
   - SubCategory: `isActive` request body'de gönderilir (`isActive`)

4. **TypeScript Tip Güvenliği**:
   - Tüm modellerde `isActive?: boolean` olarak optional tanımlanmıştır
   - State'lerde varsayılan değer `true` olarak ayarlanmıştır

## Test Senaryoları

1. ✅ Yeni ana kategori oluştururken isActive checkbox'ı çalışıyor mu?
2. ✅ Ana kategori güncellerken isActive değeri korunuyor mu?
3. ✅ Yeni alt kategori oluştururken isActive checkbox'ı çalışıyor mu?
4. ✅ Alt kategori güncellerken isActive değeri korunuyor mu?
5. ✅ Kullanıcı tarafında sadece aktif kategoriler görünüyor mu?
6. ✅ Admin panelinde tüm kategoriler görünüyor mu?

## Dosya Değişiklik Listesi

1. `src/constants/links.ts` - Yeni endpoint eklendi
2. `src/constants/enums/QueryKeys.ts` - Yeni query key eklendi
3. `src/constants/models/Category.ts` - isActive alanı eklendi
4. `src/hooks/services/categories/useActiveCategories.ts` - Yeni hook oluşturuldu
5. `src/hooks/services/categories/useCreateMainCategory.ts` - isActive parametresi eklendi
6. `src/hooks/services/categories/useUpdateMainCategory.ts` - isActive parametresi eklendi
7. `src/hooks/services/categories/useCreateSubCategory.ts` - isActive parametresi eklendi
8. `src/hooks/services/categories/useUpdateSubCategory.ts` - isActive parametresi eklendi
9. `src/components/MobileMenu.tsx` - useActiveCategories kullanıldı
10. `src/pages/products/index.tsx` - useActiveCategories kullanıldı
11. `src/pages/admin/categories/index.tsx` - Modallara isActive alanları eklendi

## Sonuç

Bu implementasyon ile:
- Admin panelinde kategorilerin aktif/pasif durumu yönetilebilir
- Kullanıcı tarafında sadece aktif kategoriler gösterilir
- API endpoint'leri doğru şekilde güncellenmiştir
- TypeScript tip güvenliği sağlanmıştır
- UI/UX iyileştirmeleri yapılmıştır
