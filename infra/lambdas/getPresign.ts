import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { json, getUserSub } from './_common';
const s3 = new S3Client({});

export const handler = async (e:any) => {
  getUserSub(e); // ensure authenticated
  const { type, contentType } = JSON.parse(e.body || '{}');
  const ext = (contentType || 'image/jpeg').includes('png') ? 'png' : 'jpg';
  const key = `${type}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const cmd = new PutObjectCommand({ Bucket: process.env.BUCKET, Key: key, ContentType: contentType || 'image/jpeg' });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
  return json(200, { url, key });
};
