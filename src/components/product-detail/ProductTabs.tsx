// import Link from "next/link";
// import Image from "next/image";
// import ReviewForm from "@/components/product-detail/ReviewForm";

// interface ProductTabsProps {
//   activeTab: string;
//   handleTabChange: (tabId: string) => void;
//   reviews: any[];
//   sortedReviews: any[];
//   sortOrder: "asc" | "desc";
//   handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
//   handleReviewImageClick: (imageUrl: string) => void;
//   handleReviewSubmit: (review: any) => void;
//   getRatingPercentage: (rating: number) => number;
//   extendedProduct: any;
//   productId: string;
// }

// const ProductTabs: React.FC<ProductTabsProps> = ({
//   activeTab,
//   handleTabChange,
//   reviews,
//   sortedReviews,
//   sortOrder,
//   handleSortChange,
//   handleReviewImageClick,
//   handleReviewSubmit,
//   getRatingPercentage,
//   extendedProduct,
//   productId,
// }) => {
//   return (
//     <div className="product-details-tab">
//       <ul
//         className="nav nav-pills justify-content-center"
//         role="tablist"
//         style={{ marginBottom: "1.5rem", gap: "1rem" }} // Added gap for spacing
//       >
//         <li className="nav-item">
//           <a
//             className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
//             id="product-review-link"
//             style={{
//               cursor: "pointer",
//               backgroundColor: activeTab === "reviews" ? "#000" : "#fff",
//               color: activeTab === "reviews" ? "#fff" : "#000",
//               border: "1px solid #000",
//               borderRadius: "4px",
//               padding: "0.75rem 1.5rem",
//               fontWeight: "500",
//               transition: "all 0.3s",
//             }}
//             onClick={() => handleTabChange("reviews")}
//             role="tab"
//             aria-controls="product-review-tab"
//             aria-selected={activeTab === "reviews"}
//             onMouseOver={(e) => {
//               if (activeTab !== "reviews") {
//                 e.currentTarget.style.backgroundColor = "#000";
//                 e.currentTarget.style.color = "#fff";
//               }
//             }}
//             onMouseOut={(e) => {
//               if (activeTab !== "reviews") {
//                 e.currentTarget.style.backgroundColor = "#fff";
//                 e.currentTarget.style.color = "#000";
//               }
//             }}
//           >
//             Değerlendirmeler ({reviews ? reviews.length : 0})
//           </a>
//         </li>
//         <li className="nav-item">
//           <a
//             className={`nav-link ${activeTab === "shipping" ? "active" : ""}`}
//             id="product-shipping-link"
//             style={{
//               cursor: "pointer",
//               backgroundColor: activeTab === "shipping" ? "#000" : "#fff",
//               color: activeTab === "shipping" ? "#fff" : "#000",
//               border: "1px solid #000",
//               borderRadius: "4px",
//               padding: "0.75rem 1.5rem",
//               fontWeight: "500",
//               transition: "all 0.3s",
//             }}
//             onClick={() => handleTabChange("shipping")}
//             role="tab"
//             aria-controls="product-shipping-tab"
//             aria-selected={activeTab === "shipping"}
//             onMouseOver={(e) => {
//               if (activeTab !== "shipping") {
//                 e.currentTarget.style.backgroundColor = "#000";
//                 e.currentTarget.style.color = "#fff";
//               }
//             }}
//             onMouseOut={(e) => {
//               if (activeTab !== "shipping") {
//                 e.currentTarget.style.backgroundColor = "#fff";
//                 e.currentTarget.style.color = "#000";
//               }
//             }}
//           >
//             Kargo ve İade
//           </a>
//         </li>
//       </ul>
//       <div className="tab-content">
//         {/* Ürün Bilgileri */}
//         <div
//           className={`tab-pane fade ${activeTab === "info" ? "show active" : ""}`}
//           id="product-info-tab"
//           role="tabpanel"
//           aria-labelledby="product-info-link"
//         >
//           <div className="product-desc-content">
//             <h3>Bilgiler</h3>
//             <p>Ürün hakkında detaylı bilgiler.</p>

//             <h3>Kumaş ve Bakım</h3>
//             <ul>
//               <li>Yüksek kaliteli kumaş</li>
//               <li>30 derecede yıkayınız</li>
//               <li>Ütü kullanmayınız</li>
//               <li>Kuru temizleme yapılabilir</li>
//             </ul>

//             <h3>Beden</h3>
//             <p>
//               {extendedProduct.sizes
//                 ? extendedProduct.sizes.join(", ")
//                 : "Standart beden"}
//             </p>
//           </div>
//         </div>

//         {/* Kargo ve İade */}
//         <div
//           className={`tab-pane fade ${activeTab === "shipping" ? "show active" : ""}`}
//           id="product-shipping-tab"
//           role="tabpanel"
//           aria-labelledby="product-shipping-link"
//         >
//           <div
//             className="shipping-returns-card"
//             style={{
//               backgroundColor: "#fff",
//               border: "1px solid #dee2e6",
//               borderRadius: "8px",
//               padding: "1.5rem",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <h3
//               style={{
//                 textDecoration: "underline",
//                 fontSize: "1.5rem",
//                 fontWeight: "600",
//                 marginBottom: "1rem",
//                 color: "#333",
//               }}
//             >
//               Teslimat ve İadeler
//             </h3>
//             <p
//               style={{
//                 fontSize: "1rem",
//                 color: "#555",
//                 lineHeight: "1.6",
//                 marginBottom: "1rem",
//               }}
//             >
//               Türkiye'nin her yerine teslimat yapıyoruz. Teslimat seçenekleri
//               hakkında detaylı bilgi için{" "}
//               <Link href="/faq" legacyBehavior>
//                 <a
//                   style={{
//                     color: "#007bff",
//                     textDecoration: "none",
//                     fontWeight: "500",
//                   }}
//                 >
//                   Kargo Bilgileri
//                 </a>
//               </Link>{" "}
//               sayfamızı ziyaret edebilirsiniz.
//             </p>
//             <p
//               style={{
//                 fontSize: "1rem",
//                 color: "#555",
//                 lineHeight: "1.6",
//               }}
//             >
//               Her alışverişinizden memnun kalmanızı umuyoruz, ancak ürünü iade
//               etmeniz gerekirse, teslim aldıktan sonra 14 gün içinde iade
//               edebilirsiniz. İade işlemi hakkında detaylı bilgi için{" "}
//               <Link href="/faq" legacyBehavior>
//                 <a
//                   style={{
//                     color: "#007bff",
//                     textDecoration: "none",
//                     fontWeight: "500",
//                   }}
//                 >
//                   İade Bilgileri
//                 </a>
//               </Link>{" "}
//               sayfamızı inceleyebilirsiniz.
//             </p>
//           </div>
//         </div>

//         {/* Değerlendirmeler */}
//         <div
//           className={`tab-pane fade ${activeTab === "reviews" ? "show active" : ""}`}
//           id="product-review-tab"
//           role="tabpanel"
//           aria-labelledby="product-review-link"
//         >
//           <div className="reviews">
//             <div className="sort-dropdown">
//               <label htmlFor="sortOrder">Değerlendirmeleri Sırala:</label>
//               <select
//                 className="form-control"
//                 id="sortOrder"
//                 onChange={handleSortChange}
//                 value={sortOrder}
//                 style={{
//                   width: "auto",
//                   display: "inline-block",
//                   marginLeft: "10px",
//                 }}
//               >
//                 <option value="desc">Puan: Yüksekten Düşüğe</option>
//                 <option value="asc">Puan: Düşükten Yükseğe</option>
//               </select>
//             </div>
//             <h3
//               style={{
//                 marginBottom: "1.5rem",
//                 fontWeight: "600",
//                 fontSize: "1.5rem",
//               }}
//             >
//               Değerlendirmeler ({reviews ? reviews.length : 0})
//             </h3>
//             {sortedReviews.map((review, index) => (
//               <div
//                 className="review-card"
//                 key={index}
//                 style={{
//                   backgroundColor: "#fff",
//                   border: "1px solid #dee2e6",
//                   borderRadius: "8px",
//                   padding: "1.5rem",
//                   marginBottom: "1.5rem",
//                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                   display: "flex",
//                   alignItems: "flex-start",
//                   gap: "1rem",
//                 }}
//               >
//                 <div style={{ flex: 1 }}>
//                   <h4
//                     style={{
//                       fontSize: "1.2rem",
//                       fontWeight: "600",
//                       marginBottom: "0.5rem",
//                       color: "#333",
//                     }}
//                   >
//                     {review.customerName || "Kullanıcı"}
//                   </h4>
//                   <div
//                     className="ratings-container"
//                     style={{ marginBottom: "0.5rem" }}
//                   >
//                     <div className="ratings" style={{ display: "flex", gap: "2px" }}>
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <span
//                           key={star}
//                           style={{
//                             fontSize: "18px",
//                             color: star <= review.rating ? "#fcb941" : "#ccc",
//                           }}
//                         >
//                           ★
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <h5
//                     style={{
//                       fontSize: "1rem",
//                       fontWeight: "500",
//                       marginBottom: "0.5rem",
//                       color: "#555",
//                     }}
//                   >
//                     {review.title || "Değerlendirme"}
//                   </h5>
//                   <p
//                     style={{
//                       fontSize: "0.95rem",
//                       color: "#666",
//                       lineHeight: "1.5",
//                       wordBreak: "break-word",
//                       whiteSpace: "pre-wrap",
//                     }}
//                   >
//                     {review.content}
//                   </p>
//                 </div>
//                 {review.imageUrl && (
//                   <div
//                     className="review-image"
//                     style={{
//                       flexShrink: 0,
//                       width: "120px",
//                       height: "120px",
//                       borderRadius: "8px",
//                       overflow: "hidden",
//                       border: "1px solid #ddd",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => handleReviewImageClick(review.imageUrl!)}
//                   >
//                     <Image
//                       src={review.imageUrl}
//                       alt="Review Image"
//                       width={120}
//                       height={120}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//             <ReviewForm productId={productId} onSubmit={handleReviewSubmit} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductTabs;