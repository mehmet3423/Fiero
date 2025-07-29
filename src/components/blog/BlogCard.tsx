import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BlogPost } from "@/data/blogData";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="blog-article-item rounded shadow-sm mb-4 overflow-hidden w-100 h-100 d-flex flex-column">
      <div className="article-thumb position-relative">
        {post.type === "gallery" && post.images ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="owl-carousel owl-simple owl-light owl-nav-inside"
          >
            {post.images.map((image, index) => (
              <SwiperSlide key={index}>
                <Link href={`/blog/${post.id}`}>
                  <Image
                    src={image}
                    alt={`${post.title} - image ${index + 1}`}
                    width={400}
                    height={250}
                    style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "12px" }}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Link href={`/blog/${post.id}`}>
            <Image
              src={post.image || "/assets/site/images/blog/placeholder.jpg"}
              alt={post.title}
              width={400}
              height={250}
              style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "12px" }}
            />
          </Link>
        )}
        {/* Optional label/category badge */}
        {post.categories && post.categories.length > 0 && (
          <div className="article-label position-absolute top-0 start-0 m-2">
            <Link href={`/blog/category/${post.categories[0].toLowerCase()}`} className="tf-btn btn-sm radius-3 btn-fill animate-hover-btn">
              {post.categories[0]}
            </Link>
          </div>
        )}
      </div>
      <div className="article-content p-3 d-flex flex-column h-100">
        <div>
          <div className="d-flex align-items-center mb-2 text-muted small">
            <span className="me-2">
              <i className="icon-user me-1"></i> {post.author}
            </span>
            <span className="me-2">
              <i className="icon-calendar me-1"></i> {post.date}
            </span>
            <span>
              <i className="icon-comment me-1"></i> {post.comments} Yorum
            </span>
          </div>
          <div className="article-title mb-2">
            <Link href={`/blog/${post.id}`} className="h5 text-dark fw-bold">
              {post.title}
            </Link>
          </div>
          <div className="article-cats mb-2">
            {post.categories.map((category, index) => (
              <React.Fragment key={category}>
                <Link href={`/blog/category/${category.toLowerCase()}`} className="badge bg-light text-dark me-1">
                  {category}
                </Link>
              </React.Fragment>
            ))}
          </div>
          <div className="article-excerpt text-muted mb-1">
            <p className="mb-1">{post.excerpt}</p>
          </div>
        </div>
        <div className="article-btn mt-2">
          <Link href={`/blog/${post.id}`} className="tf-btn btn-line fw-6">
            Okumaya Devam Et <i className="icon icon-arrow1-top-left"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
