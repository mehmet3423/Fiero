// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { blogPosts } from "@/data/blogData";

// const BlogPosts: React.FC = () => {
//   // Ana sayfada gösterilecek son 3 blog gönderisi
//   const latestPosts = blogPosts.slice(0, 3);

//   return (
//     <div className="blog-posts">
//       <div className="container">
//         <hr className="mb-4" />

//         <h2 className="title text-center">Bloglarımız</h2>

//         <div
//           className="owl-carousel owl-simple carousel-equal-height carousel-with-shadow"
//           data-toggle="owl"
//           data-owl-options='{
//                 "nav": false,
//                 "dots": true,
//                 "margin": 20,
//                 "loop": false,
//                 "responsive": {
//                     "0": {
//                         "items":1
//                     },
//                     "600": {
//                         "items":2
//                     },
//                     "992": {
//                         "items":3
//                     }
//                 }
//             }'
//         >
//           {latestPosts.map((post) => (
//             <article key={post.id} className="entry">
//               <figure className="entry-media">
//                 <Link href={`/blog/${post.id}`}>
//                   <Image
//                     src={
//                       post.image || "/assets/site/images/blog/placeholder.jpg"
//                     }
//                     alt={post.title}
//                     width={300}
//                     height={200}
//                     style={{
//                       width: "100%",
//                       height: "auto",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </Link>
//               </figure>

//               <div className="entry-body">
//                 <div className="entry-meta">
//                   <Link href="#">{post.date}</Link>
//                   <span className="meta-separator">|</span>
//                   <Link href="#">{post.comments} Yorumlar</Link>
//                 </div>

//                 <h3 className="entry-title">
//                   <Link href={`/blog/${post.id}`}>{post.title}</Link>
//                 </h3>

//                 <div className="entry-content">
//                   <p>{post.excerpt}</p>
//                   <Link href={`/blog/${post.id}`} className="read-more">
//                     Devamını Oku
//                   </Link>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogPosts;
