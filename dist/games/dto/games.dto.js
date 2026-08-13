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
exports.CreateDigitalProductDto = exports.UpdatePackageDto = exports.CreatePackageDto = exports.UpdateGameDto = exports.CreateGameDto = exports.PackageItem = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class PackageItem {
    packageName;
    priceMmk;
    stockQuantity;
    originalPrice;
    static _OPENAPI_METADATA_FACTORY() {
        return { packageName: { required: true, type: () => String }, priceMmk: { required: true, type: () => Number, minimum: 0 }, stockQuantity: { required: false, type: () => Number }, originalPrice: { required: false, type: () => Number } };
    }
}
exports.PackageItem = PackageItem;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PackageItem.prototype, "packageName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PackageItem.prototype, "priceMmk", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PackageItem.prototype, "stockQuantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PackageItem.prototype, "originalPrice", void 0);
class CreateGameDto {
    id;
    name;
    category;
    image;
    posterUrl;
    description;
    popular;
    sortOrder;
    packages;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, category: { required: true, enum: ["mobile_games", "pc_games", "gift_card", "mobile_app", "redeem_code", "social_service"] }, image: { required: false, type: () => String }, posterUrl: { required: false, type: () => String }, description: { required: false, type: () => String }, popular: { required: false, type: () => Boolean }, sortOrder: { required: false, type: () => Number }, packages: { required: true, type: () => [require("./games.dto").PackageItem], minItems: 1 } };
    }
}
exports.CreateGameDto = CreateGameDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGameDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGameDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.GameCategory),
    __metadata("design:type", String)
], CreateGameDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGameDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGameDto.prototype, "posterUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGameDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateGameDto.prototype, "popular", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PackageItem),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], CreateGameDto.prototype, "packages", void 0);
class UpdateGameDto {
    name;
    category;
    image;
    posterUrl;
    description;
    popular;
    isActive;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, category: { required: false, enum: ["mobile_games", "pc_games", "gift_card", "mobile_app", "redeem_code", "social_service"] }, image: { required: false, type: () => String }, posterUrl: { required: false, type: () => String }, description: { required: false, type: () => String }, popular: { required: false, type: () => Boolean }, isActive: { required: false, type: () => Boolean }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.UpdateGameDto = UpdateGameDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGameDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.GameCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGameDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGameDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGameDto.prototype, "posterUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGameDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateGameDto.prototype, "popular", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateGameDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateGameDto.prototype, "sortOrder", void 0);
class CreatePackageDto {
    packageName;
    priceMmk;
    stockQuantity;
    originalPrice;
    static _OPENAPI_METADATA_FACTORY() {
        return { packageName: { required: true, type: () => String }, priceMmk: { required: true, type: () => Number, minimum: 0 }, stockQuantity: { required: false, type: () => Number }, originalPrice: { required: false, type: () => Number } };
    }
}
exports.CreatePackageDto = CreatePackageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "packageName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePackageDto.prototype, "priceMmk", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePackageDto.prototype, "stockQuantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePackageDto.prototype, "originalPrice", void 0);
class UpdatePackageDto {
    packageName;
    priceMmk;
    stockQuantity;
    originalPrice;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { packageName: { required: false, type: () => String }, priceMmk: { required: false, type: () => Number, minimum: 0 }, stockQuantity: { required: false, type: () => Number }, originalPrice: { required: false, type: () => Number }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdatePackageDto = UpdatePackageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePackageDto.prototype, "packageName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePackageDto.prototype, "priceMmk", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePackageDto.prototype, "stockQuantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePackageDto.prototype, "originalPrice", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePackageDto.prototype, "isActive", void 0);
class CreateDigitalProductDto {
    name;
    category;
    description;
    image;
    priceMmk;
    isAvailable;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, category: { required: false, type: () => String }, description: { required: false, type: () => String }, image: { required: false, type: () => String }, priceMmk: { required: true, type: () => Number, minimum: 0 }, isAvailable: { required: false, type: () => Boolean } };
    }
}
exports.CreateDigitalProductDto = CreateDigitalProductDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDigitalProductDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDigitalProductDto.prototype, "priceMmk", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDigitalProductDto.prototype, "isAvailable", void 0);
//# sourceMappingURL=games.dto.js.map