// Payment response từ /{orderId}/pay
export interface PaymentResponseDto {
    paymentUrl: string;
}

// VNPAY return query params
export interface VnpayReturnResponse {
    vnp_Amount?: string;
    vnp_BankCode?: string;
    vnp_BankTranNo?: string;
    vnp_CardType?: string;
    vnp_OrderInfo?: string;
    vnp_PayDate?: string;
    vnp_ResponseCode?: string;
    vnp_TmnCode?: string;
    vnp_TransactionNo?: string;
    vnp_TransactionStatus?: string;
    vnp_TxnRef?: string;
    vnp_SecureHash?: string;
}
