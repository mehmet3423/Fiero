import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogPagination from "@/components/blog/BlogPagination";
import { blogPosts, popularPosts, categories, tags } from "@/data/blogData";

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Kategori slug'ına göre blog gönderilerini filtrele
  const filteredPosts = blogPosts.filter((post) =>
    post.categories.some((category) => category.toLowerCase() === slug)
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Geçerli sayfadaki gönderileri hesapla
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // Kategori adını bul
  const categoryName =
    categories.find((cat) => cat.name.toLowerCase() === slug)?.name ||
    String(slug);

  return (
    <main className="main">
      <div
        className="page-header text-center"
        style={{
          backgroundImage: "url('/assets/site/images/page-header-bg.jpg')",
        }}
      >
        <div className="container">
          <h1 className="page-title">
            Category: {categoryName}
            <span>Blog</span>
          </h1>
        </div>
      </div>

      <nav aria-label="breadcrumb" className="breadcrumb-nav mb-3">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Anasayfa</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/blog">Blog</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Category: {categoryName}
            </li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              {filteredPosts.length > 0 ? (
                <>
                  <div
                    className="entry-container max-col-2"
                    data-layout="fitRows"
                  >
                    {currentPosts.map((post) => (
                      <div key={post.id} className="entry-item col-sm-6">
                        <BlogCard post={post} />
                      </div>
                    ))}
                  </div>

                  <BlogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="text-center py-5">
                  <h3>Bu kategoriye ait yazı bulunamadı.</h3>
                  <p>
                    Lütfen diğer kategorileri kontrol ediniz veya{" "}
                    <Link href="/blog">blog ana sayfasına</Link> dönünüz.
                  </p>
                </div>
              )}
            </div>

            <aside className="col-lg-3">
              <BlogSidebar
                popularPosts={popularPosts}
                categories={categories}
                tags={tags}
              />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
