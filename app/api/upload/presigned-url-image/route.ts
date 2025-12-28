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
    const { imageFileName, imageFileType } = body;

    // Image is required
    if (!imageFileName || !imageFileType) {
      return NextResponse.json(
        { error: "imageFileName and imageFileType are required" },
        { status: 400 }
      );
    }

    // Generate presigned URL for image
    const imageCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: imageFileName,
      ContentType: imageFileType,
    });

    const imageUploadURL = await getSignedUrl(s3Client, imageCommand, { expiresIn: 3600 });
    const imageFileURL = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${imageFileName}`;

    return NextResponse.json({
      uploadURL: imageUploadURL,
      fileURL: imageFileURL,
    });
  } catch (error) {
    console.error("Error generating presigned URL for image:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}


