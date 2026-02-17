import { GeneralContentType } from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import { useRouter } from "next/router";
import { useMemo } from "react";

const BlogDetailByIdPage = () => {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const { contents, isLoading } = useGeneralContents(GeneralContentType.BlogPosts);

  const post = useMemo(() => {
    const items = contents || [];
    // Match by id or by slug
    const byId = items.find((it) => it.id === id);
    if (byId) return byId;
    return items.find((it) => (it.contentUrl || "").split("/").filter(Boolean).pop() === id);
  }, [contents, id]);

  return (
    <main className="main">
      <div className="tf-page-title">
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <div className="heading text-center">{post?.title || "Blog"}</div>
            </div>
          </div>
        </div>
      </div>

      <section className="flat-spacing-25">
        <div className="container">
          {isLoading && !post && <div className="text-center py-5">Yükleniyor...</div>}
          {!post && !isLoading && (
            <div className="text-center py-5">Yazı bulunamadı.</div>
          )}
          {post && (
            <article className="entry bg-white p-4 p-md-5 shadow-sm radius-8">
              {post.imageUrl && (
                <div className="entry-image-wrapper">
                  <img src={post.imageUrl} alt={post.title || "blog-image"} className="entry-image" />
                </div>
              )}
              <div className="entry-content" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
            </article>
          )}
        </div>
      </section>

      <style jsx>{`
        .radius-8 { border-radius: 8px; }
        .entry-image-wrapper {
          max-width: 560px;
          margin: 0 auto 1.5rem;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 16 / 10;
        }
        .entry-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .entry-content :global(p) { line-height: 1.9; color: #222; margin-bottom: 14px; }
        .entry-content :global(h2), .entry-content :global(h3) { margin: 24px 0 12px; }
      `}</style>
    </main>
  );
};

export default BlogDetailByIdPage;
