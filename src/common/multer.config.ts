import { diskStorage, Options } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const uploadRoot = join(process.cwd(), 'uploads');
const uploadDir = uploadRoot;

const ensureDir = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

export const storageOptions = (dest: string): Options['storage'] => {
  return diskStorage({
    destination: (req, file, cb) => {
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${Date.now()}-${randomName}${extname(file.originalname)}`);
    },
  });
};

export const imageFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/image\/(jpeg|png|gif|webp)$/)) {
    cb(new Error('Only image files are allowed'), false);
  } else {
    cb(null, true);
  }
};

export const gamesStorage = storageOptions(join(uploadDir, 'games'));
export const bannerStorage = storageOptions(join(uploadDir, 'banners'));
export const productStorage = storageOptions(join(uploadDir, 'digital-products'));

export const toPublicPath = (p?: string): string | undefined => {
  if (!p) return p;
  return p.replace(uploadDir, '/uploads');
};