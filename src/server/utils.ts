import { S3Helper } from '../utils/s3';

export const S3Controller = new S3Helper(import.meta.env.BUCKET);
