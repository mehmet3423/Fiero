import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/context/useCart";
import QuickView from "@/components/product/QuickView";
import { useGetProductListByIds } from "@/hooks/services/products/useGetProductListByIds";
import { Product } from "@/constants/models/Product";

const CompareProducts = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ids = JSON.parse(localStorage.getItem('compareProducts') || '[]');
      setCompareIds(ids);
    }
  }, []);

  // URL'den add parametresini okuyup ürünü listeye ekle
  useEffect(() => {
    if (router.isReady && router.query.add) {
      const productIdToAdd = router.query.add as string;
      
      if (typeof window !== "undefined") {
        const currentIds = JSON.parse(localStorage.getItem('compareProducts') || '[]');
        
        // Eğer ürün zaten listede değilse ekle
        if (!currentIds.includes(productIdToAdd)) {
          const updatedIds = [...currentIds, productIdToAdd];
          localStorage.setItem('compareProducts', JSON.stringify(updatedIds));
          setCompareIds(updatedIds);
        }
        
        // URL'den parametreyi temizle
        router.replace('/compare-products', undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query.add]);

  const { products, isLoading } = useGetProductListByIds(compareIds);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleRemove = (id: string) => {
    const updated = compareIds.filter((pid) => pid !== id);
    setCompareIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem('compareProducts', JSON.stringify(updated));
    }
  };

  return (
    <>
      <Head>
        <title>Compare Products</title>
      </Head>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Compare Products</div>
        </div>
      </div>
      <section className="flat-spacing-12">
        <div className="container">
          <div className="tf-compare-table">
            {/* Ürünler */}
            <div className="tf-compare-row tf-compare-grid">
              <div className="tf-compare-col d-md-block d-none"></div>
              {isLoading ? (
                <div>Loading...</div>
              ) : products && products.length > 0 ? (
                products.map((product) => (
                  <div className="tf-compare-col" key={product.id}>
                    <div className="tf-compare-item">
                      <div className="tf-compare-remove link" onClick={() => handleRemove(product.id)}>
                        Remove
                      </div>
                      <a className="tf-compare-image" href={`/products/${product.id}`}>
                        <Image
                          src={product.baseImageUrl || "/assets/images/no-image.jpg"}
                          alt={product.title}
                          width={220}
                          height={300}
                          style={{ objectFit: "contain", background: "#fff", borderRadius: 12 }}
                          unoptimized
                        />
                      </a>
                      <a className="tf-compare-title" href={`/products/${product.id}`}>{product.title}</a>
                      <div className="price">
                        {product.discountedPrice && product.discountedPrice !== product.price ? (
                          <>
                            <span className="compare-at-price">{product.price?.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
                            <span className="price-on-sale">{product.discountedPrice?.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
                          </>
                        ) : (
                          <>{product.price?.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</>
                        )}
                      </div>
                      <div className="tf-compare-group-btns d-flex gap-10">
                        <button 
                          className="tf-btn btn-outline-dark radius-3"
                          onClick={() => handleQuickView(product)}
                        >
                          <span className="icon icon-view"></span>
                          <span>QUICK VIEW</span>
                        </button>
                        <button 
                          className="tf-btn btn-outline-dark radius-3"
                          onClick={() => addToCart(product.id)}
                        >
                          <span className="icon icon-bag"></span>
                          <span>QUICK ADD</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center" style={{ flex: 1, padding: "2rem" }}>Karşılaştırılacak ürün yok.</div>
              )}
            </div>
            {/* Özellikler */}
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Availability</h6>
              </div>
              {products && products.length > 0 && products.map((product) => (
                <div className="tf-compare-col tf-compare-field tf-compare-stock" key={product.id}>
                  <div className="icon">
                    <span className="icon-check" style={{ color: '#4caf50', fontWeight: 700 }}>&#10003;</span>
                  </div>
                  <span className="fw-5">{product.sellableQuantity > 0 ? "In Stock" : "Out of Stock"}</span>
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Vendor</h6>
              </div>
              {products && products.length > 0 && products.map((product) => (
                <div className="tf-compare-col tf-compare-value text-center" key={product.id}>NORS</div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {selectedProduct && (
        <QuickView
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
          product={selectedProduct}
        />
      )}
      
      {/* ...style jsx kısmı aynı kalabilir... */}
    </>
  );
};

export default CompareProducts;