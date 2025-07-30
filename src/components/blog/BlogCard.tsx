import React from "react";
import Link from "next/link";
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
    <div className="blog-article-item">
      <div className="article-thumb">
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
                  <img
                    className="lazyload"
                    data-src={image}
                    src={image}
                    alt={`${post.title} - image ${index + 1}`}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Link href={`/blog/${post.id}`}>
            <img
              className="lazyload"
              data-src={post.image || "/assets/site/images/blog/placeholder.jpg"}
              src={post.image || "/assets/site/images/blog/placeholder.jpg"}
              alt={post.title}
            />
          </Link>
        )}
        {post.categories && post.categories.length > 0 && (
          <div className="article-label">
            <Link href={`/blog/category/${post.categories[0].toLowerCase()}`} className="tf-btn btn-sm radius-3 btn-fill animate-hover-btn">
              {post.categories[0]}
            </Link>
          </div>
        )}
      </div>
      <div className="article-content">
        <div className="article-title">
          <Link href={`/blog/${post.id}`} className="">
            {post.title}
          </Link>
        </div>
        <div className="article-btn">
          <Link href={`/blog/${post.id}`} className="tf-btn btn-line fw-6">
            Read more<i className="icon icon-arrow1-top-left"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
