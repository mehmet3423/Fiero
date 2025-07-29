import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PopularPost } from "@/data/blogData";

interface PopularPostCardProps {
  post: PopularPost;
}

const PopularPostCard: React.FC<PopularPostCardProps> = ({ post }) => {
  return (
    <li className="popular-post-card d-flex align-items-center mb-3 p-2 rounded shadow-sm">
      <div className="popular-post-img me-3 rounded overflow-hidden" style={{ minWidth: 80, minHeight: 80 }}>
        <Link href={`/blog/${post.id}`}>
          <Image src={post.image} alt={post.title} width={80} height={80} style={{ borderRadius: '8px', objectFit: 'cover' }} />
        </Link>
      </div>
      <div className="popular-post-content flex-grow-1">
        <span className="text-muted small d-block mb-1">{post.date}</span>
        <h4 className="mb-0" style={{ fontSize: '1rem', fontWeight: 500 }}>
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </h4>
      </div>
    </li>
  );
};

export default PopularPostCard;
