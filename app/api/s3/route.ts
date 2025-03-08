import { getFileMetadata, getSignedDeleteUrl, getSignedDownloadUrl, getSignedUploadUrl } from '@/lib/s3/utils';
import { NextRequest, NextResponse } from 'next/server';
// import { withApiAuthRequired } from '@auth0/nextjs-auth0';

/**
 * Get a signed URL for uploading or downloading a file to or from S3.
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {
  const operation = req.nextUrl.searchParams.get('operation');
  const fileName = req.nextUrl.searchParams.get('fileName');
  const fileType = req.nextUrl.searchParams.get('fileType');
  const key = req.nextUrl.searchParams.get('key');

  if (!operation) {
    return NextResponse.json({ error: 'Operation is required' }, { status: 400 });
  }

  switch (operation) {
    case 'upload': {
      if (!fileName || !fileType) {
        return NextResponse.json({ error: 'File name and type are required' }, { status: 400 });
      }

      const key = `uploads/${Date.now()}-${fileName as string}`;

      try {
        const signedUrl = await getSignedUploadUrl(key, fileType as string);
        console.log('Generated signed URL:', signedUrl);
        return NextResponse.json({ signedUrl, key }, { status: 200 });
      } catch (error) {
        console.error('Error getting signed URL:', error);
        return NextResponse.json({ error: 'Error generating signed URL' }, { status: 500 });
      }
    }

    case 'download': {
      if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
      }

      try {
        // const signedUrl = await getSignedDownloadUrl(key as string);
        const [signedUrl, metadata] = await Promise.all([getSignedDownloadUrl(key), getFileMetadata(key)]);
        console.log('Generated signed URL:', signedUrl);
        return NextResponse.json({ signedUrl, metadata }, { status: 200 });
      } catch (error) {
        console.error('Error retrieving file information:', error);
        return NextResponse.json({ error: 'Error retrieving file information' }, { status: 500 });
      }
    }

    case 'delete': {
      if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
      }

      try {
        const signedUrl = await getSignedDeleteUrl(key);
        console.log('Generated signed URL:', signedUrl);
        return NextResponse.json({ signedUrl }, { status: 200 });
      } catch (error) {
        console.error('Error getting signed URL:', error);
        return NextResponse.json({ error: 'Error generating signed URL' }, { status: 500 });
      }
    }

    default:
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
  }
}
