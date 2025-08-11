# DesaDeri Frontend

Bu proje Next.js ile geliştirilmiş bir e-ticaret frontend uygulamasıdır.

## Özellikler

- **Çok Dilli Destek**: Türkçe ve İngilizce dil desteği
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **E-ticaret Fonksiyonları**: Ürün listeleme, sepet, ödeme
- **Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi
- **Admin Paneli**: Ürün ve kategori yönetimi

## Lokalizasyon (Çok Dilli Destek)

Proje `next-intl` kütüphanesi kullanılarak çok dilli destek sağlanmıştır.

### Kurulum

1. **Bağımlılıklar yüklü olmalı**:

```bash
npm install next-intl
```

2. **Çeviri dosyaları** `src/locales/` klasöründe bulunur:

```
src/locales/
├── tr/
│   ├── common.json
│   └── auth.json
├── en/
│   ├── common.json
│   └── auth.json
└── index.ts
```

### Kullanım

#### Bileşenlerde Çeviri Kullanımı

```tsx
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("auth.register");
  const tCommon = useTranslations("common");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
      <button>{tCommon("buttons.save")}</button>
    </div>
  );
}
```

#### Sayfalarda Çeviri Kullanımı

```tsx
import { NextPage } from "next";
import { useTranslations } from "next-intl";

const MyPage: NextPage = () => {
  const t = useTranslations("auth.register");

  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
};

export default MyPage;
```

#### Dil Değiştirme

Header bileşeninde bulunan `LanguageSwitcher` bileşeni ile dil değiştirilebilir.

### Çeviri Dosyası Yapısı

```json
{
  "auth": {
    "register": {
      "title": "Kayıt Ol",
      "subtitle": "Yeni hesap oluşturun",
      "firstName": "Ad",
      "lastName": "Soyad",
      "email": "E-posta",
      "password": "Şifre",
      "confirmPassword": "Şifre Tekrarı",
      "registerButton": "Kayıt Ol",
      "errors": {
        "passwordMismatch": "Şifreler eşleşmiyor",
        "termsRequired": "Kullanım şartlarını kabul etmelisiniz"
      }
    }
  },
  "common": {
    "buttons": {
      "save": "Kaydet",
      "cancel": "İptal",
      "loading": "Yükleniyor..."
    },
    "validation": {
      "required": "Bu alan zorunludur",
      "email": "Geçerli bir e-posta adresi giriniz"
    }
  }
}
```

### Yeni Dil Ekleme

1. `src/locales/` klasöründe yeni dil klasörü oluşturun (örn: `de/`)
2. Gerekli çeviri dosyalarını ekleyin
3. `src/locales/index.ts` dosyasında `locales` array'ine yeni dili ekleyin

### URL Yapısı

- Türkçe (varsayılan): `/register`
- İngilizce: `/en/register`

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusunu başlat
npm start
```

## Teknolojiler

- **Next.js 15**: React framework
- **TypeScript**: Tip güvenliği
- **next-intl**: Lokalizasyon
- **React Query**: Veri yönetimi
- **Bootstrap**: CSS framework
- **React Hot Toast**: Bildirimler

## Proje Yapısı

```
src/
├── components/          # React bileşenleri
├── locales/            # Çeviri dosyaları
├── hooks/              # Custom hooks
├── constants/          # Sabitler ve enum'lar
├── pages/              # Next.js sayfaları
├── styles/             # CSS dosyaları
└── utils/              # Yardımcı fonksiyonlar
```

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
