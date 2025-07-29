import React, { useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogPagination from "@/components/blog/BlogPagination";
import { blogPosts, popularPosts, categories, tags } from "@/data/blogData";

const BlogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  // Geçerli sayfadaki gönderileri hesapla
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

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
      <div className="blog-grid-main py-5">
        <div className="container">
          <div className="row">
            {/* Blog Grid */}
            <div className="col-xl-9 col-lg-9">
              <div className="px-3" style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div className="row">
                  {currentPosts.map((post) => (
                    <div key={post.id} className="col-xl-4 col-md-6 col-12 mb-4">
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
