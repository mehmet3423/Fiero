import React from "react";
import Link from "next/link";
import { PopularPost, Category, Tag } from "@/data/blogData";
import PopularPostCard from "./PopularPostCard";
import CategoryList from "./CategoryList";

interface BlogSidebarProps {
  popularPosts: PopularPost[];
  categories: Category[];
  tags: Tag[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  popularPosts,
  categories,
  tags,
}) => {
  return (
    <aside className="blog-sidebar">
      <div className="widget widget-search rounded shadow-sm mb-4 p-3 bg-white">
        <h3 className="widget-title mb-3">Arama</h3>
        <form action="#" className="d-flex">
          <input
            type="search"
            className="form-control me-2 rounded"
            name="ws"
            id="ws"
            placeholder="Blogda Ara"
            required
            style={{ minWidth: 0 }}
          />
          <button type="submit" className="btn btn-primary rounded">
            <i className="icon-search"></i>
            <span className="sr-only">Arama</span>
          </button>
        </form>
      </div>

      <div className="widget widget-cats rounded shadow-sm mb-4 p-3 bg-white">
        <h3 className="widget-title mb-3">Kategoriler</h3>
        <CategoryList categories={categories} />
      </div>

      <div className="widget rounded shadow-sm mb-4 p-3 bg-white">
        <h3 className="widget-title mb-3">Popüler Yazılar</h3>
        <ul className="posts-list list-unstyled">
          {popularPosts.map((post) => (
            <PopularPostCard key={post.id} post={post} />
          ))}
        </ul>
      </div>

      {/*
      <div className="widget widget-banner-sidebar rounded shadow-sm mb-4 p-3 bg-white">
        <div className="banner-sidebar-title">Reklam Kutusu 280 x 280</div>
        <div className="banner-sidebar banner-overlay">
          <Link href="#">
            <Image
              src="/assets/site/images/blog/sidebar/banner.jpg"
              alt="banner"
              width={280}
              height={280}
            />
          </Link>
        </div>
      </div>
      */}

      <div className="widget rounded shadow-sm mb-4 p-3 bg-white">
        <h3 className="widget-title mb-3">Etiketler</h3>
        <div className="tagcloud d-flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag.name} href={`/blog/tag/${tag.name.toLowerCase()}`} className="badge bg-light text-dark px-2 py-1 rounded">
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/*
      <div className="widget widget-text rounded shadow-sm mb-4 p-3 bg-white">
        <h3 className="widget-title mb-3">Blog Hakkında</h3>
      </div>
      */}
    </aside>
  );
};

export default BlogSidebar;
