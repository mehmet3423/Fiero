import Head from "next/head";
import { useGetSeoById } from "@/hooks/services/admin-seo/useGetSeoById";
import { useGetSeoByCanonical } from "@/hooks/services/admin-seo/useGetSeoByCanonical";
import { useGetSeoBySlug } from "@/hooks/services/admin-seo/useGetSeoBySlug";

interface SEOHeadProps {
  seoId?: string;
  canonical?: string;
  slug?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ seoId, canonical, slug }) => {
  // Priority: seoId > canonical > slug
  let seoData, isLoading;
  if (seoId) {
    const result = useGetSeoById(seoId);
    seoData = result.seoData;
    isLoading = result.isLoading;
  } else if (canonical) {
    const result = useGetSeoByCanonical(canonical);
    seoData = result.seoData;
    isLoading = result.isLoading;
  } else if (slug) {
    const result = useGetSeoBySlug(slug);
    seoData = result.seoData;
    isLoading = result.isLoading;
  } else {
    seoData = null;
    isLoading = false;
  }

  // Structured data
  let structuredData = null;
  if (seoData?.structuredDataJson) {
    try {
      structuredData = JSON.parse(seoData.structuredDataJson);
    } catch {
      structuredData = null;
    }
  }

  // SEO verisi yoksa varsayılan meta tag'ler
  if (!seoData) {
    return (
      <Head>
        <title>Eser Leather - Online Shopping</title>
        <meta name="description" content="Eser Leather online alışveriş sitesi" />
        <meta name="author" content="Eser Leather" />
        <meta name="publisher" content="Eser Leather" />
      </Head>
    );
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoData.metaTitle || seoData.title}</title>
      <meta
        name="description"
        content={seoData.metaDescription || seoData.description}
      />
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      {seoData.robotsMetaTag && (
        <meta name="robots" content={seoData.robotsMetaTag} />
      )}
      {seoData.canonical && <link rel="canonical" href={seoData.canonical} />}
      <meta name="author" content={seoData.author || "Eser Leather"} />
      <meta name="publisher" content={seoData.publisher || "Eser Leather"} />
      {seoData.language && (
        <meta httpEquiv="content-language" content={seoData.language} />
      )}

      {/* Open Graph Tags */}
      {seoData.ogTitle && (
        <meta property="og:title" content={seoData.ogTitle} />
      )}
      {seoData.ogDescription && (
        <meta property="og:description" content={seoData.ogDescription} />
      )}
      <meta property="og:type" content="website" />
      {seoData.ogImageUrl && (
        <meta property="og:image" content={seoData.ogImageUrl} />
      )}
      {seoData.ogImageUrl && (
        <meta
          property="og:image:alt"
          content={`${seoData.ogTitle || seoData.title} - Görsel`}
        />
      )}
      {seoData.ogImageUrl && <meta property="og:image:width" content="1200" />}
      {seoData.ogImageUrl && <meta property="og:image:height" content="630" />}
      <meta property="og:site_name" content="Eser Leather" />
      {seoData.language && (
        <meta property="og:locale" content={seoData.language} />
      )}

      {/* Twitter Cards */}
      {seoData.ogTitle && (
        <meta name="twitter:title" content={seoData.ogTitle} />
      )}
      {seoData.ogDescription && (
        <meta name="twitter:description" content={seoData.ogDescription} />
      )}
      {seoData.ogImageUrl && (
        <meta name="twitter:image" content={seoData.ogImageUrl} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@norsworldwide" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Loading state for dynamic SEO */}
      {isLoading && <meta name="robots" content="noindex,nofollow" />}
    </Head>
  );
};

export default SEOHead;
