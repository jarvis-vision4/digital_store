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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const games_service_1 = require("./games.service");
const games_dto_1 = require("./dto/games.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const enums_1 = require("../common/enums");
const public_decorator_1 = require("../common/decorators/public.decorator");
const multer_config_1 = require("../common/multer.config");
let GamesController = class GamesController {
    gamesService;
    constructor(gamesService) {
        this.gamesService = gamesService;
    }
    getDigitalProducts() {
        return this.gamesService.getDigitalProducts();
    }
    getDigitalProductById(id) {
        return this.gamesService.getDigitalProductById(id);
    }
    getDigitalProductsAdmin() {
        return this.gamesService.getDigitalProductsAdmin();
    }
    storeDigitalProduct(dto, image) {
        const imagePath = (0, multer_config_1.toPublicPath)(image?.path);
        return this.gamesService.storeDigitalProduct(dto, imagePath);
    }
    updateDigitalProduct(id, dto, image) {
        const imagePath = (0, multer_config_1.toPublicPath)(image?.path);
        return this.gamesService.updateDigitalProduct(id, dto, imagePath);
    }
    addVariant(id, dto) {
        return this.gamesService.addVariant(id, dto);
    }
    updateVariant(id, dto) {
        return this.gamesService.updateVariant(id, dto);
    }
    deleteVariant(id) {
        return this.gamesService.deleteVariant(id);
    }
    addFeature(id, dto) {
        return this.gamesService.addFeature(id, dto);
    }
    deleteFeature(id) {
        return this.gamesService.deleteFeature(id);
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('digital-products'),
    (0, swagger_1.ApiOperation)({ summary: 'Browse all active digital products' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "getDigitalProducts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('digital-products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single digital product with variants and features' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "getDigitalProductById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Get)('admin/digital-products'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all digital products (admin)' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "getDigitalProductsAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Post)('admin/digital-products'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: multer_config_1.productStorage, fileFilter: multer_config_1.imageFilter })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a digital product with optional variants and features' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                description: { type: 'string' },
                priceMmk: { type: 'number' },
                rating: { type: 'number' },
                badge: { type: 'string', description: 'e.g. HOT, NEW' },
                isAvailable: { type: 'boolean' },
                image: { type: 'string', format: 'binary' },
                variants: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', example: '1 Month Pro' },
                            durationDays: { type: 'number', example: 30 },
                            priceMmk: { type: 'number', example: 8500 },
                            priceUsd: { type: 'number', example: 1.5 },
                            badge: { type: 'string', example: 'HOT' },
                            sortOrder: { type: 'number' },
                        },
                    },
                },
                features: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', example: 'All Pro Filters & Effects' },
                            sortOrder: { type: 'number' },
                        },
                    },
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [games_dto_1.CreateDigitalProductDto, Object]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "storeDigitalProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Put)('admin/digital-products/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: multer_config_1.productStorage, fileFilter: multer_config_1.imageFilter })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a digital product (replaces variants/features if provided)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                description: { type: 'string' },
                priceMmk: { type: 'number' },
                rating: { type: 'number' },
                badge: { type: 'string' },
                isAvailable: { type: 'boolean' },
                image: { type: 'string', format: 'binary' },
                variants: { type: 'array', items: { type: 'object' } },
                features: { type: 'array', items: { type: 'object' } },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, games_dto_1.CreateDigitalProductDto, Object]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "updateDigitalProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Post)('admin/digital-products/:id/variants'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a variant to a digital product' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "addVariant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Put)('admin/digital-product-variants/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a variant' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "updateVariant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Delete)('admin/digital-product-variants/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a variant' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "deleteVariant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Post)('admin/digital-products/:id/features'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a feature to a digital product' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "addFeature", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Delete)('admin/digital-product-features/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a feature' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "deleteFeature", null);
exports.GamesController = GamesController = __decorate([
    (0, swagger_1.ApiTags)('Digital Products'),
    (0, common_1.Controller)('v1'),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], GamesController);
//# sourceMappingURL=games.controller.js.map