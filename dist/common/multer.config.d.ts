import { Options } from 'multer';
export declare const uploadRoot: string;
export declare const storageOptions: (dest: string) => Options["storage"];
export declare const imageFilter: (req: any, file: Express.Multer.File, cb: any) => void;
export declare const gamesStorage: import("multer").StorageEngine | undefined;
export declare const bannerStorage: import("multer").StorageEngine | undefined;
export declare const productStorage: import("multer").StorageEngine | undefined;
export declare const toPublicPath: (p?: string) => string | undefined;
