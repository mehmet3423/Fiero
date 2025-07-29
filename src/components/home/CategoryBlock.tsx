import { Category } from "@/constants/models/Category";
import { useProductsByCategory } from "@/hooks/services/products/useProductsByCategory";
import { useEffect, useState } from "react";
import PageLoadingAnimation from "../shared/PageLoadingAnimation";
import ProductCard from "./ProductCard";

interface CategoryBlockProps {
  mainCategory: Category;
}

export default function CategoryBlock({ mainCategory }: CategoryBlockProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const [hasProducts, setHasProducts] = useState(false);
  const { products, isLoading } = useProductsByCategory(selectedSubCategory, {
    enabled: !!selectedSubCategory,
  });

  useEffect(() => {
    const firstSubCategory = mainCategory.subCategories.$values[0]?.id;
    if (firstSubCategory && !selectedSubCategory) {
      setSelectedSubCategory(firstSubCategory);
    }
  }, []);

  useEffect(() => {
    if (products && products?.items?.$values?.length > 0) {
      setHasProducts(true);
    }
  }, [products]);

  const handleSubCategoryChange = (subCategoryId: string) => {
    if (selectedSubCategory !== subCategoryId) {
      setSelectedSubCategory(subCategoryId);
    }
  };

  if (isLoading) {
    return <PageLoadingAnimation />;
  }

  if (!hasProducts) {
    return null;
  }

  return (
    <div className="container mb-5">
      <div className="heading heading-flex mb-3">
        <div className="heading-left">
          <h2 className="title mb-0 text-dark">{mainCategory.name}</h2>
        </div>

        <div className="heading-right">
          <ul
            className="nav nav-pills nav-border-anim justify-content-center"
            role="tablist"
          >
            {mainCategory.subCategories.$values.map((subCategory) => (
              <li key={subCategory.id} className="nav-item">
                <a
                  className={`nav-link ${
                    selectedSubCategory === subCategory.id ? "active" : ""
                  }`}
                  onClick={() => handleSubCategoryChange(subCategory.id)}
                  role="tab"
                  style={{ cursor: "pointer" }}
                >
                  {subCategory.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="products mb-3">
        <div className="row">
          {!products?.items?.$values?.length ? (
            <div className="col-12">
              <div className="text-center py-5 text-muted">
                <i
                  className="icon-info-circle mb-2"
                  style={{ fontSize: "2rem" }}
                ></i>
                <p>Bu kategoride henüz ürün bulunmuyor</p>
              </div>
            </div>
          ) : (
            products.items.$values.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard
                  product={product}
                  discountedPrice={product.discountedPrice}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <hr className="mt-0" />
    </div>
  );
}
