export enum OrderSupportRequestType {
    OrderNotReceived,       // Customer didn't receive their order
    DamagedProduct,         // Product arrived damaged
    WrongItemDelivered,     // Incorrect item sent
    RefundRequest,          // Request for refund
    ExchangeRequest,        // Request to exchange an item
    PaymentIssue,           // Issues with payment processing
    OrderCancellation,      // Request to cancel an order
    DeliveryDelayInquiry,   // Questions about delivery delays
    Other                   // Miscellaneous issues
}   