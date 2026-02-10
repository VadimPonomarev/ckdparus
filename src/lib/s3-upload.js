import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from './s3';

export async function uploadFileToS3(fileBuffer, fileName, contentType) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  // Формируем URL к файлу для Beget S3
  // Используем endpoint без https:// и добавляем bucket name
  const endpoint = process.env.S3_ENDPOINT.replace('https://', '');
  return `https://${process.env.S3_BUCKET_NAME}.${endpoint}/${fileName}`;
}
