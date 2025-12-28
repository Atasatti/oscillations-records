import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Check if AWS credentials are available
const hasCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = hasCredentials ? new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}) : null;

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET_NAME || "osrecord";
const region = process.env.AWS_REGION || "us-east-1";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST /api/upload/presigned-urls - Get presigned URLs for both image and audio
export async function POST(request: NextRequest) {
  try {
    // Check if AWS is configured
    if (!hasCredentials || !s3Client) {
      return NextResponse.json(
        { error: "AWS credentials not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { audioFileName, audioFileType, imageFileName, imageFileType } = body;

    // Audio is required
    if (!audioFileName || !audioFileType) {
      return NextResponse.json(
        { error: "audioFileName and audioFileType are required" },
        { status: 400 }
      );
    }

    const results: {
      audio: { uploadURL: string; fileURL: string };
      image?: { uploadURL: string; fileURL: string };
    } = {} as {
      audio: { uploadURL: string; fileURL: string };
      image?: { uploadURL: string; fileURL: string };
    };

    // Generate presigned URL for audio (required)
    const audioCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: audioFileName,
      ContentType: audioFileType,
    //   ACL: 'public-read',
    });

    const audioUploadURL = await getSignedUrl(s3Client, audioCommand, { expiresIn: 3600 });
    const audioFileURL = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${audioFileName}`;

    results.audio = {
      uploadURL: audioUploadURL,
      fileURL: audioFileURL,
    };

    // Generate presigned URL for image (if provided)
    if (imageFileName && imageFileType) {
      const imageCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: imageFileName,
        ContentType: imageFileType,
        // ACL: 'public-read',
      });

      const imageUploadURL = await getSignedUrl(s3Client, imageCommand, { expiresIn: 3600 });
      const imageFileURL = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${imageFileName}`;

      results.image = {
        uploadURL: imageUploadURL,
        fileURL: imageFileURL,
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URLs" },
      { status: 500 }
    );
  }
}

