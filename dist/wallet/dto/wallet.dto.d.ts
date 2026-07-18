export declare class SubmitDepositDto {
    amount: number;
    paymentMethod: string;
    phone: string;
    transactionId?: string;
    screenshotUrl?: string;
}
export declare class RedeemCouponDto {
    code: string;
}
export declare class GenerateCouponDto {
    code: string;
    amount: number;
}
