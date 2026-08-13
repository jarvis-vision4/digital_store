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
    findAll() {
        return this.gamesService.findAll();
    }
    findOne(id) {
        return this.gamesService.findOne(id);
    }
    upload(files) {
        const image = files?.image?.[0] ?? files?.file?.[0];
        if (!image) {
            throw new common_1.BadRequestException('image or file field is required');
        }
        return { url: (0, multer_config_1.toPublicPath)(image.path) };
    }
    create(body, image) {
        const dto = {
            ...body,
            packages: typeof body.packages === 'string' ? JSON.parse(body.packages) : body.packages,
        };
        const imagePath = (0, multer_config_1.toPublicPath)(image?.path);
        return this.gamesService.create(dto, imagePath);
    }
    update(id, dto, image) {
        const imagePath = (0, multer_config_1.toPublicPath)(image?.path);
        return this.gamesService.update(id, dto, imagePath);
    }
    remove(id) {
        return this.gamesService.remove(id);
    }
    addPackage(id, dto) {
        return this.gamesService.addPackage(id, dto);
    }
    updatePackage(packageId, dto) {
        return this.gamesService.updatePackage(packageId, dto);
    }
    getDigitalProducts() {
        return this.gamesService.getDigitalProducts();
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
};
exports.GamesController = GamesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('games'),
    (0, swagger_1.ApiOperation)({ summary: 'Browse all active games with packages' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('games/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get game details with packages' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Post)('admin/games/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
    ], { storage: multer_config_1.gamesStorage, fileFilter: multer_config_1.imageFilter })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a game image and return its URL (admin)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary', description: 'Game image (either image or file field)' },
                file: { type: 'string', format: 'binary', description: 'Game image (either image or file field)' },
            },
        },
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "upload", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Post)('admin/games'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: multer_config_1.gamesStorage, fileFilter: multer_config_1.imageFilter })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new game (admin) - upload an image file' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                category: { type: 'string' },
                image: { type: 'string', format: 'binary' },
                posterUrl: { type: 'string' },
                description: { type: 'string' },
                popular: { type: 'boolean' },
                sortOrder: { type: 'number' },
                packages: { type: 'string', description: 'JSON string array of packages, e.g. [{"packageName":"100 Diamonds","priceMmk":1000}]' },
            },
        },
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Put)('admin/games/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: multer_config_1.gamesStorage, fileFilter: multer_config_1.imageFilter })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a game (admin) - optional image file' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                image: { type: 'string', format: 'binary' },
                posterUrl: { type: 'string' },
                description: { type: 'string' },
                popular: { type: 'boolean' },
                isActive: { type: 'boolean' },
                sortOrder: { type: 'number' },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, games_dto_1.UpdateGameDto, Object]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Delete)('admin/games/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a game (admin)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Post)('admin/games/:id/packages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a package to a game (admin)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, games_dto_1.CreatePackageDto]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "addPackage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Put)('admin/packages/:package_id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a game package (admin)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('package_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, games_dto_1.UpdatePackageDto]),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "updatePackage", null);
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.MODERATOR),
    (0, common_1.Get)('admin/digital-products'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all digital products with key counts (admin)' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Create a digital product (admin) - optional image file' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                description: { type: 'string' },
                priceMmk: { type: 'number' },
                isAvailable: { type: 'boolean', description: 'Manual availability flag (default true)' },
                image: { type: 'string', format: 'binary' },
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
    (0, swagger_1.ApiOperation)({ summary: 'Update a digital product (admin) - optional image file' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                description: { type: 'string' },
                priceMmk: { type: 'number' },
                isAvailable: { type: 'boolean', description: 'Manual availability flag (default true)' },
                image: { type: 'string', format: 'binary' },
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
exports.GamesController = GamesController = __decorate([
    (0, swagger_1.ApiTags)('Games'),
    (0, common_1.Controller)('v1'),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], GamesController);
//# sourceMappingURL=games.controller.js.map