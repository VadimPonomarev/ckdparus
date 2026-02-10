// lib/s3-get.js
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3Client from './s3';

export async function getFileFromS3(fileName) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
  };

  const command = new GetObjectCommand(params);
  const response = await s3Client.send(command);
  return response.Body;
}
