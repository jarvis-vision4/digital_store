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
exports.UpdateBannerDto = exports.CreateBannerDto = exports.UpdateTelegramBotDto = exports.UpdateNoticeDto = exports.UpdateSecuritySettingsDto = exports.UpdatePaymentSettingsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePaymentSettingsDto {
    accountName;
    kbzPayNumber;
    wavePayNumber;
    ayaPayNumber;
    uabPayNumber;
    thaiBankDetails;
    static _OPENAPI_METADATA_FACTORY() {
        return { accountName: { required: false, type: () => String }, kbzPayNumber: { required: false, type: () => String }, wavePayNumber: { required: false, type: () => String }, ayaPayNumber: { required: false, type: () => String }, uabPayNumber: { required: false, type: () => String }, thaiBankDetails: { required: false, type: () => String } };
    }
}
exports.UpdatePaymentSettingsDto = UpdatePaymentSettingsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "kbzPayNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "wavePayNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "ayaPayNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "uabPayNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentSettingsDto.prototype, "thaiBankDetails", void 0);
class UpdateSecuritySettingsDto {
    exchangeRateThaiBaht;
    static _OPENAPI_METADATA_FACTORY() {
        return { exchangeRateThaiBaht: { required: false, type: () => String } };
    }
}
exports.UpdateSecuritySettingsDto = UpdateSecuritySettingsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSecuritySettingsDto.prototype, "exchangeRateThaiBaht", void 0);
class UpdateNoticeDto {
    globalNotice;
    static _OPENAPI_METADATA_FACTORY() {
        return { globalNotice: { required: true, type: () => String } };
    }
}
exports.UpdateNoticeDto = UpdateNoticeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNoticeDto.prototype, "globalNotice", void 0);
class UpdateTelegramBotDto {
    botToken;
    chatIds;
    static _OPENAPI_METADATA_FACTORY() {
        return { botToken: { required: false, type: () => String }, chatIds: { required: false, type: () => String } };
    }
}
exports.UpdateTelegramBotDto = UpdateTelegramBotDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTelegramBotDto.prototype, "botToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTelegramBotDto.prototype, "chatIds", void 0);
class CreateBannerDto {
    id;
    title;
    imageUrl;
    description;
    badge;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, imageUrl: { required: true, type: () => String }, description: { required: false, type: () => String }, badge: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateBannerDto = CreateBannerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "badge", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBannerDto.prototype, "isActive", void 0);
class UpdateBannerDto {
    title;
    imageUrl;
    description;
    badge;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, imageUrl: { required: false, type: () => String }, description: { required: false, type: () => String }, badge: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateBannerDto = UpdateBannerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "badge", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBannerDto.prototype, "isActive", void 0);
//# sourceMappingURL=settings.dto.js.map