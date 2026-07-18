"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransactionType = exports.OrderStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MODERATOR"] = "MODERATOR";
    UserRole["CUSTOMER"] = "CUSTOMER";
})(UserRole || (exports.UserRole = UserRole = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "Pending";
    OrderStatus["Success"] = "Success";
    OrderStatus["Cancelled"] = "Cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var WalletTransactionType;
(function (WalletTransactionType) {
    WalletTransactionType["DEPOSIT"] = "DEPOSIT";
    WalletTransactionType["WITHDRAW"] = "WITHDRAW";
    WalletTransactionType["REFERRAL_BONUS"] = "REFERRAL_BONUS";
    WalletTransactionType["ORDER_SPEND"] = "ORDER_SPEND";
    WalletTransactionType["REFUND"] = "REFUND";
})(WalletTransactionType || (exports.WalletTransactionType = WalletTransactionType = {}));
//# sourceMappingURL=index.js.map