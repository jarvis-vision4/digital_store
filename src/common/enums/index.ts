export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  CUSTOMER = 'CUSTOMER',
}

export enum OrderStatus {
  Pending = 'Pending',
  Success = 'Success',
  Cancelled = 'Cancelled',
}

export enum WalletTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  REFERRAL_BONUS = 'REFERRAL_BONUS',
  ORDER_SPEND = 'ORDER_SPEND',
  REFUND = 'REFUND',
}
