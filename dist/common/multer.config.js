"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicPath = exports.productStorage = exports.bannerStorage = exports.gamesStorage = exports.imageFilter = exports.storageOptions = exports.uploadRoot = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
exports.uploadRoot = (0, path_1.join)(process.cwd(), 'uploads');
const uploadDir = exports.uploadRoot;
const ensureDir = (dir) => {
    if (!(0, fs_1.existsSync)(dir)) {
        (0, fs_1.mkdirSync)(dir, { recursive: true });
    }
};
const storageOptions = (dest) => {
    return (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            ensureDir(dest);
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            cb(null, `${Date.now()}-${randomName}${(0, path_1.extname)(file.originalname)}`);
        },
    });
};
exports.storageOptions = storageOptions;
const imageFilter = (req, file, cb) => {
    if (!file.mimetype.match(/image\/(jpeg|png|gif|webp)$/)) {
        cb(new Error('Only image files are allowed'), false);
    }
    else {
        cb(null, true);
    }
};
exports.imageFilter = imageFilter;
exports.gamesStorage = (0, exports.storageOptions)((0, path_1.join)(uploadDir, 'games'));
exports.bannerStorage = (0, exports.storageOptions)((0, path_1.join)(uploadDir, 'banners'));
exports.productStorage = (0, exports.storageOptions)((0, path_1.join)(uploadDir, 'digital-products'));
const toPublicPath = (p) => {
    if (!p)
        return p;
    return p.replace(uploadDir, '/uploads');
};
exports.toPublicPath = toPublicPath;
//# sourceMappingURL=multer.config.js.map