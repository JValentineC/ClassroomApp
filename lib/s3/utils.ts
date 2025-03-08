import axios from 'axios';
import s3Client from '@/lib/s3/client';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucketName = process.env.AWS_S3_BUCKET_NAME;

export async function getSignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function getSignedDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function getSignedDeleteUrl(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function getFileMetadata(key: string) {
  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const response = await s3Client.send(command);
    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
    };
  } catch (error) {
    console.error('Error fetching file metadata:', error);
    throw error;
  }
}

export async function listFiles(prefix: string = '') {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  return response.Contents || [];
}

export async function uploadFile(file: File): Promise<string | null> {
  try {
    // Get a signed S3 URL from the server
    const { data } = (await axios.get(`/api/s3?operation=upload&fileName=${file.name}&fileType=${file.type}`)) ?? {};
    console.log(data);

    // Use the signed URL to upload the file directly to S3
    await axios.put(data.signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    console.log('File uploaded successfully. S3 Key:', data.key);
    return data.key;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  } finally {
  }
}

export async function deleteFile(key: string) {
  try {
    // Get a signed S3 URL from the server
    const { data } = (await axios.get(`/api/s3?operation=delete&key=${key}`)) ?? {};

    // Use the signed URL to delete the file from S3
    await axios.delete(data.signedUrl);

    console.log('File deleted successfully:', key);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
