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
exports.CreateDigitalOrderDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDigitalOrderDto {
    digitalProductId;
    digitalProductVariantId;
    productName;
    variantName;
    amountMmk;
    static _OPENAPI_METADATA_FACTORY() {
        return { digitalProductId: { required: true, type: () => String }, digitalProductVariantId: { required: false, type: () => String }, productName: { required: true, type: () => String }, variantName: { required: false, type: () => String }, amountMmk: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.CreateDigitalOrderDto = CreateDigitalOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Digital product ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalOrderDto.prototype, "digitalProductId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Variant ID for subscription plans' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDigitalOrderDto.prototype, "digitalProductVariantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CapCut Pro - 1 Month' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalOrderDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1 Month Pro' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDigitalOrderDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8500 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDigitalOrderDto.prototype, "amountMmk", void 0);
//# sourceMappingURL=digital-orders.dto.js.map