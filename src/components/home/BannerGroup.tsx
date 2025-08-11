// import Image from "next/image";
// import Link from "next/link";

// // const smallBanners = [
// //   {
// //     id: 3,
// //     image:
// //       "https://static.ticimax.cloud/cdn-cgi/image/width=380,quality=85/61950/uploads/urunresimleri/buyuk/gate-postaci-cantasi-lacivert--04b2-a.jpg",

// //     link: "/products",
// //   },
// //   {
// //     id: 4,
// //     image:
// //       "https://static.ticimax.cloud/cdn-cgi/image/width=380,quality=85/61950/uploads/urunresimleri/buyuk/lios-bel-cantasi-95-d15.jpg",

// //     link: "/products",
// //   },
// //   {
// //     id: 5,
// //     image:
// //       "https://static.ticimax.cloud/cdn-cgi/image/width=380,quality=85/61950/uploads/urunresimleri/buyuk/snotra-sirt-cantasi-lacivert-9b2d-f.jpg",

// //     link: "/products?categoryId=8c133ab5-e42e-488a-9790-4da9b02b1048",
// //   },
// // ];

// export default function BannerGroup({ banners }: { banners: any[] }) {
//   return (
//     <section className="banner-collection-modern-section">
//       <div className="banner-collection-modern-wrapper">
//         {banners.map((banner) => (
//           <div key={banner.id} className="banner-collection-modern-item">
//             <BannerItem banner={banner} />
//           </div>
//         ))}
//       </div>
//       <style jsx>{`
//         .banner-collection-modern-section {
//           width: 100%;
//           background: #fff;
//           padding: 1.1rem 0 1.1rem 0;
//           margin: 0;
//           overflow-x: hidden;
//         }
//         .banner-collection-modern-wrapper {
//           display: flex;
//           flex-direction: row;
//           justify-content: center;
//           align-items: stretch;
//           gap: 2.5rem;
//           width: 100%;
//           max-width: 1280px;
//           margin: 0 auto;
//           padding: 0 5vw;
//           box-sizing: border-box;
//         }
//         .banner-collection-modern-item {
//           flex: 1 1 0;
//           background: #fafafa;
//           border-radius: 1.2rem;
//           box-shadow: 0 2px 12px rgba(0,0,0,0.07);
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: flex-end;
//           overflow: hidden;
//           min-width: 0;
//           max-width: 420px;
//           position: relative;
//           transition: box-shadow 0.2s, transform 0.2s;
//         }
//         .banner-collection-modern-item:hover {
//           box-shadow: 0 8px 32px rgba(0,0,0,0.13);
//           transform: translateY(-4px) scale(1.03);
//         }
//         @media (max-width: 1200px) {
//           .banner-collection-modern-wrapper {
//             gap: 1.2rem;
//             padding: 0 1vw;
//           }
//           .banner-collection-modern-item {
//             max-width: 320px;
//           }
//         }
//         @media (max-width: 900px) {
//           .banner-collection-modern-wrapper {
//             flex-direction: column;
//             gap: 1.2rem;
//             align-items: stretch;
//             max-width: 98vw;
//             padding: 0 0.5vw;
//           }
//           .banner-collection-modern-item {
//             max-width: 100vw;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

// // Banner Bileşeni (Tüm bannerları merkezi yönetmek için)
// const BannerItem = ({ banner }: { banner: any }) => {
//   return (
//     <div className="banner-modern-item-inner">
//       <Link href={banner.link} className="banner-modern-img-link">
//         <Image
//           src={banner.image}
//           alt={banner.alt || ''}
//           width={634}
//           height={800}
//           className="banner-modern-img"
//           unoptimized
//         />
//       </Link>
//       <div className="banner-modern-content">
//         <h5 className="banner-modern-title">{banner.title}</h5>
//         <Link href={banner.link} className="banner-modern-btn">
//           <span>Shop now</span>
//         </Link>
//       </div>
//       <style jsx>{`
//         .banner-modern-item-inner {
//           width: 100%;
//           height: 100%;
//           position: relative;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: flex-end;
//           overflow: hidden;
//         }
//         .banner-modern-img-link {
//           display: block;
//           width: 100%;
//           height: 320px;
//           position: relative;
//         }
//         .banner-modern-img {
//           object-fit: cover;
//           width: 100%;
//           height: 100%;
//           border-radius: 1.2rem 1.2rem 0 0;
//         }
//         .banner-modern-content {
//           position: absolute;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           width: 100%;
//           padding: 2rem 1.2rem 1.5rem 1.2rem;
//           background: linear-gradient(0deg,rgba(0,0,0,0.55) 70%,rgba(0,0,0,0.08) 100%,transparent 100%);
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           z-index: 2;
//         }
//         .banner-modern-title {
//           color: #fff;
//           font-size: 1.25rem;
//           font-weight: 700;
//           margin-bottom: 1.1rem;
//           text-shadow: 0 2px 8px rgba(0,0,0,0.18);
//         }
//         .banner-modern-btn {
//           display: inline-block;
//           background: #fff;
//           color: #222;
//           font-size: 1rem;
//           font-weight: 600;
//           border-radius: 2rem;
//           padding: 0.55rem 1.5rem;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.10);
//           text-decoration: none;
//           transition: background 0.18s, color 0.18s, box-shadow 0.18s;
//         }
//         .banner-modern-btn:hover {
//           background: #222;
//           color: #fff;
//           box-shadow: 0 4px 16px rgba(0,0,0,0.18);
//         }
//         @media (max-width: 1200px) {
//           .banner-modern-img-link {
//             height: 220px;
//           }
//         }
//         @media (max-width: 900px) {
//           .banner-modern-img-link {
//             height: 180px;
//           }
//           .banner-modern-content {
//             padding: 1.2rem 0.7rem 1rem 0.7rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// const styles = {
//   bannerContent: {
//     padding: "15px",
//     border: "1px solid transparent",
//     transition: "border 0.3s ease-in-out",
//   },
// };
