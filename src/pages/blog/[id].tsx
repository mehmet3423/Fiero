import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { blogPosts, popularPosts, categories, tags } from "@/data/blogData";

const BlogPostPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <main className="main">
      <div className="blog-detail py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="blog-detail-main mx-auto" style={{maxWidth: 900}}>
                {/* Tags */}
                <ul className="tags-lists justify-content-center mb-3">
                  {post.categories.map((cat: string) => (
                    <li key={cat}>
                      <Link href={`/blog/category/${cat.toLowerCase()}`} className="tags-item">
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* Title & Meta */}
                <div className="title text-center mb-2">{post.title}</div>
                <div className="meta text-center mb-4">by <span>{post.author}</span> on <span>{post.date}</span></div>
                {/* Main Image */}
                <div className="image mb-4 text-center">
                  <Image
                    src={post.image || "/assets/site/images/blog/placeholder.jpg"}
                    alt={post.title}
                    width={800}
                    height={400}
                    style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "12px" }}
                  />
                </div>
                {/* Blockquote */}
                <blockquote className="my-4 p-4 bg-light rounded">
                  <div className="icon mb-2">
                    <img src="/assets/site/images/item/quote.svg" alt="quote" style={{height: 32}} />
                  </div>
                  <div className="text">
                    Typography is the work of typesetters, compositors, typographers, graphic designers, art directors, manga artists, comic book artists, graffiti artists, and now—anyone who arranges words, letters, numbers, and symbols for publication, display, or distribution—from clerical workers and newsletter writers to anyone self-publishing materials.
                  </div>
                </blockquote>
                {/* Grid Images */}
                <div className="grid-image d-flex gap-3 mb-4">
                  <div>
                    <img src="/assets/site/images/blog/blog-detail-1.jpg" alt="" style={{width: "100%", borderRadius: "10px"}} />
                  </div>
                  <div>
                    <img src="/assets/site/images/blog/blog-detail-2.jpg" alt="" style={{width: "100%", borderRadius: "10px"}} />
                  </div>
                </div>
                {/* Description */}
                <div className="desc mb-4">
                  <p>{post.content}</p>
                </div>
                {/* Bottom Tags & Social */}
                <div className="bot d-flex justify-content-between flex-wrap align-items-center mb-4">
                  <ul className="tags-lists">
                    {tags.slice(0, 3).map((tag) => (
                      <li key={tag.name}>
                        <Link href={`/blog/tag/${tag.name.toLowerCase()}`} className="tags-item">
                          <span>{tag.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex align-items-center gap-3">
                    <p className="mb-0">Share:</p>
                    <ul className="tf-social-icon d-flex style-default mb-0">
                      <li><a href="#" className="box-icon round social-facebook border-line-black"><i className="icon fs-14 icon-fb"></i></a></li>
                      <li><a href="#" className="box-icon round social-twiter border-line-black"><i className="icon fs-12 icon-Icon-x"></i></a></li>
                      <li><a href="#" className="box-icon round social-instagram border-line-black"><i className="icon fs-14 icon-instagram"></i></a></li>
                      <li><a href="#" className="box-icon round social-tiktok border-line-black"><i className="icon fs-14 icon-tiktok"></i></a></li>
                      <li><a href="#" className="box-icon round social-pinterest border-line-black"><i className="icon fs-14 icon-pinterest-1"></i></a></li>
                    </ul>
                  </div>
                </div>
                {/* Article Navigation */}
                <div className="tf-article-navigation mb-5">
                  <div className="item position-relative d-flex w-100 prev mb-2">
                    <Link href={`/blog/${post.id - 1 > 0 ? post.id - 1 : blogPosts.length}`} className="icon">
                      <i className="icon-arrow-left"></i>
                    </Link>
                    <div className="inner ms-2">
                      <Link href={`/blog/${post.id - 1 > 0 ? post.id - 1 : blogPosts.length}`}>PREVIOUS</Link>
                      <h6 className="mb-0">
                        <Link href={`/blog/${post.id - 1 > 0 ? post.id - 1 : blogPosts.length}`}>
                          {blogPosts.find(p => p.id === (post.id - 1 > 0 ? post.id - 1 : blogPosts.length))?.title}
                        </Link>
                      </h6>
                    </div>
                  </div>
                  <div className="item position-relative d-flex w-100 justify-content-end next">
                    <div className="inner text-end me-2">
                      <Link href={`/blog/${post.id + 1 <= blogPosts.length ? post.id + 1 : 1}`}>NEXT</Link>
                      <h6 className="mb-0">
                        <Link href={`/blog/${post.id + 1 <= blogPosts.length ? post.id + 1 : 1}`}>
                          {blogPosts.find(p => p.id === (post.id + 1 <= blogPosts.length ? post.id + 1 : 1))?.title}
                        </Link>
                      </h6>
                    </div>
                    <Link href={`/blog/${post.id + 1 <= blogPosts.length ? post.id + 1 : 1}`} className="icon">
                      <i className="icon-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Related Articles */}
      <section className="mb_30">
        <div className="container">
          <div className="flat-title mb-3">
            <h5 className="">Related Articles</h5>
          </div>
          <div className="hover-sw-nav view-default hover-sw-5">
            <div className="row justify-content-center">
              {blogPosts
                .filter(
                  (p) =>
                    p.id !== post.id &&
                    p.categories.some((cat) =>
                      post.categories.includes(cat)
                    )
                )
                .slice(0, 3)
                .map((relatedPost) => (
                  <div key={relatedPost.id} className="col-xl-4 col-md-6 col-12 mb-4">
                    <div className="blog-article-item h-100 rounded shadow-sm overflow-hidden">
                      <div className="article-thumb radius-10">
                        <Link href={`/blog/${relatedPost.id}`}>
                          <Image
                            src={relatedPost.image || "/assets/site/images/blog/placeholder.jpg"}
                            alt={relatedPost.title}
                            width={300}
                            height={200}
                            style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "10px" }}
                          />
                        </Link>
                        <div className="article-label">
                          <Link href="#" className="tf-btn style-2 btn-fill radius-3 animate-hover-btn">Shop collection</Link>
                        </div>
                      </div>
                      <div className="article-content">
                        <div className="article-title">
                          <Link href={`/blog/${relatedPost.id}`}>{relatedPost.title}</Link>
                        </div>
                        <div className="article-btn">
                          <Link href={`/blog/${relatedPost.id}`} className="tf-btn btn-line fw-6">Read more<i className="icon icon-arrow1-top-left"></i></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );

}
export default BlogPostPage;
