import { S3Helper } from '../utils/s3';
import { Helper } from '../utils/helper';

export const S3Controller = new S3Helper(import.meta.env.BUCKET);
export const HelperController = new Helper();
