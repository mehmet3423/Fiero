import BlogCard from "@/components/blog/BlogCard";
import { GeneralContentType } from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const BlogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const { contents, isLoading } = useGeneralContents(GeneralContentType.BlogPosts);

  const mappedPosts = useMemo(() => {
    const items = contents || [];
    return items
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((it) => ({
        id: it.id,
        slug: (it.contentUrl || "").split("/").filter(Boolean).pop() || it.id,
        title: it.title || "",
        image: it.imageUrl || "/assets/site/images/blog/placeholder.jpg",
        type: "image",
        images: undefined,
        categories: [],
      }));
  }, [contents]);

  const totalPages = Math.ceil(mappedPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = mappedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Sayfa değiştiğinde sayfanın üstüne kaydır
    window.scrollTo(0, 0);
  };

  return (
    <main className="main">
      {/* Page Title Section */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <div className="heading text-center">Blog Grid</div>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <i className="icon-arrow-right"></i>
                </li>
                <li>Fashion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid Main Section */}
      <div className="blog-grid-main">
        <div className="container">
          <div className="row">
            {isLoading && (
              <div className="col-12 text-center py-5">Yükleniyor...</div>
            )}
            {!isLoading && currentPosts.map((post) => (
              <div key={post.id} className="col-xl-4 col-md-6 col-12">
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
