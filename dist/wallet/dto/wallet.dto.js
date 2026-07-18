"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCouponDto = exports.RedeemCouponDto = exports.SubmitDepositDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SubmitDepositDto {
    amount;
    paymentMethod;
    phone;
    transactionId;
    screenshotUrl;
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => Number, minimum: 0 }, paymentMethod: { required: true, type: () => String }, phone: { required: true, type: () => String }, transactionId: { required: false, type: () => String }, screenshotUrl: { required: false, type: () => String } };
    }
}
exports.SubmitDepositDto = SubmitDepositDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SubmitDepositDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitDepositDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitDepositDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitDepositDto.prototype, "transactionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitDepositDto.prototype, "screenshotUrl", void 0);
class RedeemCouponDto {
    code;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String } };
    }
}
exports.RedeemCouponDto = RedeemCouponDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemCouponDto.prototype, "code", void 0);
class GenerateCouponDto {
    code;
    amount;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String }, amount: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.GenerateCouponDto = GenerateCouponDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateCouponDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GenerateCouponDto.prototype, "amount", void 0);
//# sourceMappingURL=wallet.dto.js.map