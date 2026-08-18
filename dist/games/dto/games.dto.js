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
exports.CreateDigitalProductDto = exports.CreateFeatureDto = exports.CreateVariantDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
function ParseJsonArray() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || Array.isArray(value))
            return value;
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed))
                return parsed;
            return value;
        }
        catch {
            return value;
        }
    });
}
class CreateVariantDto {
    id;
    name;
    durationDays;
    priceMmk;
    priceUsd;
    badge;
    sortOrder;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number }, name: { required: true, type: () => String }, durationDays: { required: true, type: () => Number, minimum: 1 }, priceMmk: { required: true, type: () => Number, minimum: 0 }, priceUsd: { required: false, type: () => Number, minimum: 0 }, badge: { required: false, type: () => String }, sortOrder: { required: false, type: () => Number }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateVariantDto = CreateVariantDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Existing variant ID to update in place (omit to create new)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1 Month Pro' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "durationDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8500 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "priceMmk", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1.5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "priceUsd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'HOT' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "badge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateVariantDto.prototype, "isActive", void 0);
class CreateFeatureDto {
    name;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.CreateFeatureDto = CreateFeatureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'All Pro Filters & Effects' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeatureDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateFeatureDto.prototype, "sortOrder", void 0);
class CreateDigitalProductDto {
    name;
    category;
    description;
    image;
    priceMmk;
    rating;
    badge;
    isAvailable;
    variants;
    features;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, category: { required: false, type: () => String }, description: { required: false, type: () => String }, image: { required: false, type: () => String }, priceMmk: { required: true, type: () => Number, minimum: 0 }, rating: { required: false, type: () => Number, minimum: 0 }, badge: { required: false, type: () => String }, isAvailable: { required: false, type: () => Boolean }, variants: { required: false, type: () => Object }, features: { required: false, type: () => Object } };
    }
}
exports.CreateDigitalProductDto = CreateDigitalProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CapCut Pro' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Video Editing' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8500, description: 'Base price or price when no variants' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDigitalProductDto.prototype, "priceMmk", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4.9 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDigitalProductDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'HOT' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "badge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDigitalProductDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreateVariantDto] }),
    (0, class_validator_1.IsArray)(),
    ParseJsonArray(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDigitalProductDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreateFeatureDto] }),
    (0, class_validator_1.IsArray)(),
    ParseJsonArray(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDigitalProductDto.prototype, "features", void 0);
//# sourceMappingURL=games.dto.js.map