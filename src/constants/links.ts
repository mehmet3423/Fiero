const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export { BASE_URL };

export const CUSTOMER_REGISTER = `${BASE_URL}api/Authentication/CustomerRegister`;
export const SELLER_REGISTER = `${BASE_URL}api/Authentication/SellerRegister`;
export const SEND_EMAIL = `${BASE_URL}api/Authentication/SendEmailConfirmation`;
export const CONFIRM_EMAIL = `${BASE_URL}api/Authentication/ConfirmEmail`;

export const LOGIN = `${BASE_URL}api/Authentication/Login`;
export const LOGOUT = `${BASE_URL}api/Authentication/Logout`;

// Cart endpoints
export const CART = `${BASE_URL}api/Cart`;
export const CART_ADD_ITEM = `${CART}/AddItem`;
export const CART_UPDATE_QUANTITY = `${CART}/UpdateQuantity`;
export const CART_REMOVE_ITEM = `${CART}/RemoveItem`;
export const CART_CLEAR = `${CART}/Clear`;

// Favorites endpoints
export const FAVORITES = `${BASE_URL}api/Favorite`;
export const FAVORITES_ADD_PRODUCT = `${FAVORITES}/AddProduct`;
export const FAVORITES_REMOVE_PRODUCT = `${FAVORITES}/RemoveProduct`;
export const FAVORITES_CLEAR = `${FAVORITES}/Clear`;

//Auth endpoints
export const GET_USER_PROFILE = `${BASE_URL}api/Authentication/UserInfo`;
export const UPDATE_USER_PROFILE = `${BASE_URL}api/Users/CustomerProfileUpdateRequest`;

// Product endpoints
export const GET_PRODUCT_LIST_BY_SUB_CATEGORY_ID = `${BASE_URL}api/Product/GetProductListBySubCategoryId`;
export const GET_PRODUCT_LIST_BY_MAIN_CATEGORY_ID = `${BASE_URL}api/Product/GetProductListByMainCategoryId`;
export const GET_PRODUCT_BY_ID = `${BASE_URL}api/Product/GetProductById`;
export const ADD_PRODUCT = `${BASE_URL}api/Product/CreateProduct`;
export const UPDATE_PRODUCT = `${BASE_URL}api/Product/UpdateProduct`;
export const DELETE_PRODUCT = `${BASE_URL}api/Product/DeleteProduct`;
export const GET_ALL_PRODUCTS = `${BASE_URL}api/Product/GetAllProducts`;
export const GET_ALL_OUTLET_PRODUCTS = `${BASE_URL}api/Product/GetAllOutletProducts`;
export const GET_PRODUCT_LIST_BY_IDS = `${BASE_URL}api/Product/GetProductsByIds`;
export const GET_BASIC_PRODUCT_LIST = `${BASE_URL}api/Product/GetBasicProductList`;

// Category endpoints
export const GET_MAIN_CATEGORY_LIST = `${BASE_URL}api/MainCategory/GetMainCategoriesList`;
export const GET_MAIN_CATEGORY_LOOKUP_LIST = `${BASE_URL}api/MainCategory/GetMainCategoryLookupList`;
export const GET_SUB_CATEGORY_LOOKUP_LIST = `${BASE_URL}api/SubCategory/GetSubCategoryLookupListByMainCategoryId`;
export const GET_SUB_CATEGORY_LIST = `${BASE_URL}api/SubCategory/GetSubCategoriesListByMainCategoryId`;
export const CREATE_MAIN_CATEGORY = `${BASE_URL}api/MainCategory/CreateMainCategory`;
export const CREATE_SUB_CATEGORY = `${BASE_URL}api/SubCategory/CreateSubCategory`;
export const UPDATE_MAIN_CATEGORY = `${BASE_URL}api/MainCategory/UpdateMainCategory`;
export const UPDATE_SUB_CATEGORY = `${BASE_URL}api/SubCategory/UpdateSubCategory`;
export const DELETE_MAIN_CATEGORY = `${BASE_URL}api/MainCategory/DeleteMainCategory`;
export const DELETE_SUB_CATEGORY = `${BASE_URL}api/SubCategory/DeleteSubCategory`;
export const GET_ALL_MAIN_CATEGORIES = `${BASE_URL}api/MainCategory/GetAllMainCategories`;

// Sub Category Specification endpoints
export const GET_SUB_CATEGORY_SPECIFICATION_LIST = `${BASE_URL}api/SubCategorySpecification/GetSubCategorySpecificationsList`;
export const CREATE_SUB_CATEGORY_SPECIFICATION = `${BASE_URL}api/SubCategorySpecification/CreateSubCategorySpecification`;
export const UPDATE_SUB_CATEGORY_SPECIFICATION = `${BASE_URL}api/SubCategorySpecification/UpdateSubCategorySpecification`;
export const DELETE_SUB_CATEGORY_SPECIFICATION = `${BASE_URL}api/SubCategorySpecification/DeleteSubCategorySpecification`;

// Product Specification endpoints
export const GET_PRODUCT_SPECIFICATION_LIST = `${BASE_URL}api/ProductOnlySpecification/GetProductOnlySpecificationsList`;
export const CREATE_PRODUCT_SPECIFICATION = `${BASE_URL}api/ProductOnlySpecification/CreateProductOnlySpecification`;
export const UPDATE_PRODUCT_SPECIFICATION = `${BASE_URL}api/ProductOnlySpecification/UpdateProductOnlySpecification`;
export const DELETE_PRODUCT_SPECIFICATION = `${BASE_URL}api/ProductOnlySpecification/DeleteProductOnlySpecification`;

// Review endpoints
export const ADD_REVIEW = `${BASE_URL}api/Comment/CreateComment`;
export const GET_REVIEWS = `${BASE_URL}api/Comment/GetCommentListByProduct`;
export const UPDATE_REVIEW = `${BASE_URL}api/Comment/UpdateComment`;
export const DELETE_REVIEW = `${BASE_URL}api/Comment/DeleteComment`;
export const GET_USER_REVIEWS = `${BASE_URL}api/Comment/GetCommentListByCustomer`;

// Order endpoints
export const CREATE_ORDER = `${BASE_URL}api/Order/CreateOrder`;
export const GET_ORDER_BY_ID = `${BASE_URL}api/Order/GetOrderById`;
export const GET_CUSTOMER_ORDERS = `${BASE_URL}api/Order/GetOrderListByCustomerId`;
export const GET_SELLER_ORDERS = `${BASE_URL}api/Order/GetOrderListBySellerId`;
export const GET_USER_ORDERS = `${BASE_URL}api/Order/GetUsersOrderList`;
export const UPDATE_ORDER = `${BASE_URL}api/Order/UpdateOrder`;
export const DELETE_ORDER = `${BASE_URL}api/Order/DeleteOrder`;
export const COMPLETE_ORDER = `${BASE_URL}api/Order/CompleteOrder`;
export const PAYMENT_SUCCESS_COMPLETE_ORDER = `${BASE_URL}api/Order/PaymentSuccessfulCompleteOrder`;
export const PAYMENT_FAILED_ABORT_ORDER = `${BASE_URL}api/Order/PaymentFailedAbortOrder`;
export const GET_ALL_ORDERS = `${BASE_URL}api/Order/GetAllOrderList`;

// User Card endpoints
export const GET_USER_CARD_LIST = `${BASE_URL}api/UserPaymentCards/GetCurrentUsersCards`;
export const CREATE_USER_CARD = `${BASE_URL}api/UserPaymentCards/CreateUserPaymentCard`;
export const DELETE_USER_CARD = `${BASE_URL}api/UserPaymentCards/DeleteUserPaymentCard`;
export const UPDATE_USER_CARD = `${BASE_URL}api/UserPaymentCards/UpdateUserPaymentCard`;

// Payment endpoints
export const MAKE_PAYMENT = `${BASE_URL}api/Payments/MakePayment`;
export const NOTIFY_FRONTEND = `${BASE_URL}api/Payments/NotifyFrontend`;
export const RETRIEVE_CARDS = `${BASE_URL}api/Payments/RetrieveCards`;
export const GET_PAYMENT_DETAIL = `${BASE_URL}api/Payments/GetPaymentDetail`;
export const GET_INSTALLMENT_INFO = `${BASE_URL}api/Payments/GetInstallmentInfo`;
export const CHECK_BIN = `${BASE_URL}api/Payments/CheckBin`;
export const PROCESS_REFUND_ITEMS = `${BASE_URL}api/Payments/ProcessRefundItems`;
export const PROCESS_REFUND_ITEMS_BY_ORDER = `${BASE_URL}api/Payments/ProcessRefundItemsByOrder`;

// User Address endpoints
export const GET_USER_ADDRESS_LIST = `${BASE_URL}api/Address/GetUsersAddressList`;
export const CREATE_USER_ADDRESS = `${BASE_URL}api/Address/CreateAddress`;
export const UPDATE_USER_ADDRESS = `${BASE_URL}api/Address/UpdateAddress`;
export const DELETE_USER_ADDRESS = `${BASE_URL}api/Address/DeleteAddress`;
export const GET_COUNTRIES = `${BASE_URL}api/Address/countries`;
export const GET_PROVİNCES = `${BASE_URL}api/Address/provinces`;
export const GET_DISTRICTS = (provinceId: string) =>
  `${BASE_URL}api/Address/districts/${provinceId}`;

// General Content endpoints
export const GET_GENERAL_CONTENT = `${BASE_URL}api/GeneralContent/GetGeneralContent`;
export const CREATE_GENERAL_CONTENT = `${BASE_URL}api/GeneralContent/CreateGeneralContent`;
export const UPDATE_GENERAL_CONTENT = `${BASE_URL}api/GeneralContent/UpdateGeneralContent`;
export const DELETE_GENERAL_CONTENT = `${BASE_URL}api/GeneralContent/DeleteGeneralContent`;
export const GET_GENERAL_CONTENTS_LIST = `${BASE_URL}api/GeneralContent/GetGeneralContentsList`;
export const GET_ALL_GENERAL_CONTENTS = `${BASE_URL}api/GeneralContent/GetAllGeneralContents`;
export const DELETE_SUPPORT_TICKET = `${BASE_URL}api/GeneralSupportTicket/General/DeleteGeneralSupportTicket`;

// Support Ticket endpoints
export const CREATE_SUPPORT_TICKET = `${BASE_URL}api/GeneralSupportTicket/General/CreateGeneralSupportTicket`;
export const GET_SUPPORT_TICKETS = `${BASE_URL}api/GeneralSupportTicket/General/GetAllGeneralSupportTickets`;
export const GET_SUPPORT_TICKET_BY_ID = `${BASE_URL}api/GeneralSupportTicket/General/GetGeneralSupportById`;
export const CREATE_ORDER_SUPPORT_TICKET = `${BASE_URL}api/OrderSupportTicket/Order/CreateOrderSupportTicket`;
export const LOCATION_BASE_URL = process.env.NEXT_PUBLIC_LOCATION_BASE_URL;

// Discount endpoints
export const CREATE_PRODUCT_DISCOUNT = `${BASE_URL}api/Discount/CreateProductDiscount`;
export const CREATE_SUBCATEGORY_DISCOUNT = `${BASE_URL}api/Discount/CreateSubCategoryDiscount`;
export const CREATE_BUNDLE_DISCOUNT = `${BASE_URL}api/Discount/CreateBundleDiscount`;
export const CREATE_CART_DISCOUNT = `${BASE_URL}api/Discount/CreateCartDiscount`;
export const CREATE_TIME_OF_DAY_DISCOUNT = `${BASE_URL}api/Discount/CreateTimeOfDayDiscount`;
export const CREATE_WEEKDAY_DISCOUNT = `${BASE_URL}api/Discount/CreateWeekdayDiscount`;
export const CREATE_BIRTHDAY_DISCOUNT = `${BASE_URL}api/Discount/CreateBirthdayDiscount`;
export const CREATE_SPECIAL_DAY_DISCOUNT = `${BASE_URL}api/Discount/CreateSpecialDayDiscount`;
export const CREATE_COUPON_DISCOUNT = `${BASE_URL}api/Discount/CreateCouponDiscount`;
export const GET_DISCOUNT_BY_ID = `${BASE_URL}api/Discount/GetDiscountById`;
export const GET_DISCOUNT_LIST = `${BASE_URL}api/Discount/GetDiscountList`;
export const DELETE_DISCOUNT = `${BASE_URL}api/Discount/DeleteDiscount`;
export const CREATE_SHIPPING_DISCOUNT = `${BASE_URL}api/Discount/CreateCargoDiscount`;
export const CREATE_BUY_X_PAY_Y_DISCOUNT = `${BASE_URL}api/Discount/CreateBuyXPayYDiscount`;

//Update Discount
export const UPDATE_SHIPPING_DISCOUNT = `${BASE_URL}api/Discount/UpdateCargoDiscount`;
export const UPDATE_PRODUCT_DISCOUNT = `${BASE_URL}api/Discount/UpdateProductDiscount`;
export const UPDATE_SUBCATEGORY_DISCOUNT = `${BASE_URL}api/Discount/UpdateSubCategoryDiscount`;
export const UPDATE_BUNDLE_DISCOUNT = `${BASE_URL}api/Discount/UpdateBundleDiscount`;
export const UPDATE_CART_DISCOUNT = `${BASE_URL}api/Discount/UpdateCartDiscount`;
export const UPDATE_TIME_OF_DAY_DISCOUNT = `${BASE_URL}api/Discount/UpdateTimeOfDayDiscount`;
export const UPDATE_WEEKDAY_DISCOUNT = `${BASE_URL}api/Discount/UpdateWeekdayDiscount`;
export const UPDATE_BIRTHDAY_DISCOUNT = `${BASE_URL}api/Discount/UpdateBirthdayDiscount`;
export const UPDATE_SPECIAL_DAY_DISCOUNT = `${BASE_URL}api/Discount/UpdateSpecialDayDiscount`;
export const UPDATE_COUPON_DISCOUNT = `${BASE_URL}api/Discount/UpdateCouponDiscount`;
export const UPDATE_FREE_PRODUCT_DISCOUNT = `${BASE_URL}api/Discount/UpdateFreeProductDiscount`;

// Affiliate endpoints
export const GET_CURRENT_USER_AFFILIATE_USER = `${BASE_URL}api/AffiliateUsers/GetCurrentUsersAffiliateUser`;
export const APPLY_FOR_AFFILIATE = `${BASE_URL}api/AffiliateUsers/ApplyForAffiliate`;
export const UPDATE_AFFILIATE_STATUS_BY_USER = `${BASE_URL}api/AffiliateUsers/UpdateAffiliateStatusByUser`;
export const UPDATE_COLLECTION_BASED_COLLECTION = `${BASE_URL}api/AffiliateCollections/UpdateCollectionBasedCollectionForAdmin`;
export const UPDATE_COMBINATION_BASED_COLLECTION = `${BASE_URL}api/AffiliateCollections/UpdateCombinationBasedCollectionForAdmin`;
export const UPDATE_CATEGORY_BASED_COLLECTION = `${BASE_URL}api/AffiliateCollections/UpdateCategoryBasedCollectionForAdmin`;
export const GET_AFFILIATE_USER_BY_AFFILIATE_USER_ID = `${BASE_URL}api/AffiliateUsers`;
// Affiliate Collections endpoints
export const GET_CURRENT_USERS_COLLECTIONS = `${BASE_URL}api/AffiliateCollections/GetCurrentUsersCollections`;
export const CREATE_AFFILIATE_COLLECTION = `${BASE_URL}api/AffiliateCollections/Create`;
export const CREATE_COMBINATION_BASED_COLLECTION = `${BASE_URL}api/AffiliateCollections/CreateCombinationBasedCollection`;
export const CREATE_CATEGORY_BASED_COLLECTION = `${BASE_URL}api/AffiliateCollections/CreateCategoryBasedCollection`;
export const CREATE_PRODUCT_BASED_COLLECTION = `${BASE_URL}api/AffiliateCollections/CreateProductBasedCollection`;
export const CREATE_COLLECTION_BASED_COLLECTION = `${BASE_URL}api/AffiliateCollections/CreateCollectionBasedCollection`;
export const UPDATE_AFFILIATE_COLLECTION = `${BASE_URL}api/AffiliateCollections/UpdateCollectionForUser`;
export const DELETE_AFFILIATE_COLLECTION = `${BASE_URL}api/AffiliateCollections`;
export const GET_AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID = (
  affiliateUserId: string
) =>
  `${BASE_URL}api/AffiliateCollections/GetByAffiliateUserId/${affiliateUserId}`;
export const GET_AFFILIATE_COLLECTION_BY_ID = `${BASE_URL}api/AffiliateCollections`;
export const GET_CURRENT_USER_AFFILIATE_PAYOUTS = `${BASE_URL}api/AffiliatePayout/GetCurrentUserAffiliatePayouts`;
export const CREATE_AFFILIATE_PAYOUT_REQUEST = `${BASE_URL}api/AffiliatePayout/CreatePayoutRequest`;
export const UPDATE_PRODUCT_BASED_COLLECTION = `${BASE_URL}api/AffiliateCollections/UpdateProductBasedCollectionForAdmin`;
// AffiliateUser endpoints
export const GET_AFFILIATE_USER_LIST = `${BASE_URL}api/AffiliateUsers/GetAffiliateUserList`;
export const CHANGE_AFFILIATE_USER_STATUS = `${BASE_URL}api/AffiliateUsers/UpdateAffiliateStatusByAdmin`;

// AffiliateCommission endpoints
export const GET_AFFILIATE_COMMISSION_BY_AFFILIATE_USER_ID = `${BASE_URL}api/AffiliateCommissions/GetByAffiliateUserId`;
export const TRANSFER_ELIGIBLE_COMMISSIONS_TO_EARNINGS = `${BASE_URL}api/AffiliateCommissions/TransferEligibleCommissionsToEarnings`;

// SEO endpoints
export const CREATE_SEO = `${BASE_URL}api/SEO/CreateSEO`;
export const GET_SEO_BY_ID = `${BASE_URL}api/SEO/GetSEOById`;
export const GET_SEO_BY_SLUG = `${BASE_URL}api/SEO/GetSEOBySlug`;
export const GET_SEO_LIST = `${BASE_URL}api/SEO/GetSEOList`;
export const UPDATE_SEO = `${BASE_URL}api/SEO/UpdateSEO`;
export const DELETE_SEO = `${BASE_URL}api/SEO/DeleteSEO`;
export const CHECK_CANONICAL_EXISTS = `${BASE_URL}api/SEO/CheckCanonicalExists`;
export const GET_SEO_BY_CANONICAL = `${BASE_URL}api/SEO/GetSEOByCanonical`;

// Settings endpoints
export const GET_SYSTEM_SETTINGS = `${BASE_URL}api/SystemSettings`;
export const UPDATE_SYSTEM_SETTINGS = `${BASE_URL}api/SystemSettings`;
export const GET_SYSTEM_SETTING_TYPES = `${BASE_URL}api/EnumOptiosns/GetSystemSettingTypes`;
export const CREATE_SYSTEM_SETTING = `${BASE_URL}api/SystemSettings`;
export const DELETE_SYSTEM_SETTING = `${BASE_URL}api/SystemSettings`;

// Reports endpoints
export const GET_STOCK_REPORT = `${BASE_URL}api/Reports/StockReportPaginated`;
export const GET_PASSIVE_PRODUCTS_REPORT = `${BASE_URL}api/Reports/PassiveProductsReportPaginated`;
export const GET_MEDIA_MISSING_PRODUCTS_REPORT = `${BASE_URL}api/Reports/MediaMissingProductsReportPaginated`;
export const GET_MOST_RATED_PRODUCTS_REPORT = `${BASE_URL}api/Reports/MostRatedProductsReportPaginated`;
export const GET_MOST_LIKED_PRODUCTS_REPORT = `${BASE_URL}api/Reports/MostLikedProductsReportPaginated`;
export const GET_MOST_COMMENTED_PRODUCTS_REPORT = `${BASE_URL}api/Reports/MostCommentedProductsReportPaginated`;
export const GET_FAVORITE_PRODUCTS_REPORT = `${BASE_URL}api/Reports/FavoriteProductsReportPaginated`;
export const GET_PRODUCT_RETURN_REPORT = `${BASE_URL}api/Reports/ProductReturnReportPaginated`;
export const GET_RETURN_REASON_REPORT = `${BASE_URL}api/Reports/ReturnReasonReportPaginated`;
export const GET_PRODUCT_CART_REPORT = `${BASE_URL}api/Reports/ProductCartReportPaginated`;
export const GET_UNSOLD_PRODUCTS_REPORT = `${BASE_URL}api/Reports/UnsoldProductsReportPaginated`;
export const GET_PRODUCT_SALES_REPORT = `${BASE_URL}api/Reports/ProductSalesReportPaginated`;

// Reports with excel
export const GET_STOCK_REPORT_EXCEL = `${BASE_URL}api/Reports/StockReportExcel`;
export const GET_PASSIVE_PRODUCTS_REPORT_EXCEL = `${BASE_URL}api/Reports/PassiveProductsReportExcel`;
export const GET_MEDIA_MISSING_PRODUCTS_REPORT_EXCEL = `${BASE_URL}api/Reports/MediaMissingProductsReportExcel`;
export const GET_MOST_RATED_PRODUCTS_REPORT_EXCEL = `${BASE_URL}api/Reports/MostRatedProductsReportExcel`;
export const GET_MOST_LIKED_PRODUCTS_REPORT_EXCEL = `${BASE_URL}api/Reports/MostLikedProductsReportExcel`;
export const GET_MOST_COMMENTED_PRODUCTS_REPORT_EXCEL = `${BASE_URL}api/Reports/MostCommentedProductsReportExcel`;
export const GET_FAVORITE_PRODUCTS_REPORT_EXCEL = `${BASE_URL}api/Reports/FavoriteProductsReportExcel`;
export const GET_PRODUCT_RETURN_REPORT_EXCEL = `${BASE_URL}api/Reports/ProductReturnReportExcel`;
export const GET_RETURN_REASON_REPORT_EXCEL = `${BASE_URL}api/Reports/ReturnReasonReportExcel`;
export const GET_PRODUCT_CART_REPORT_EXCEL = `${BASE_URL}api/Reports/ProductCartReportExcel`;
export const GET_UNSOLD_PRODUCTS_REPORT_EXCEL = `${BASE_URL}api/Reports/UnsoldProductsReportExcel`;
export const GET_PRODUCT_SALES_REPORT_EXCEL = `${BASE_URL}api/Reports/ProductSalesReportExcel`;

//Get Coupon Discount
export const GET_COUPON_DISCOUNT = `${BASE_URL}api/Discount/GetCouponDiscount`;

//Sitemap Item
export const GET_PAGINATED_SITEMAP_ITEMS = `${BASE_URL}api/SitemapItems/GetPaginated`;
export const GET_BY_ID_SITEMAP_ITEM = `${BASE_URL}api/SitemapItems`;
export const GET_ALL_SITEMAP_ITEMS = `${BASE_URL}api/SitemapItems/GetAll`;
export const CREATE_SITEMAP_ITEM = `${BASE_URL}api/SitemapItems`;
export const DELETE_SITEMAP_ITEM = `${BASE_URL}api/SitemapItems`;
export const UPDATE_SITEMAP_ITEM = `${BASE_URL}api/SitemapItems`;
