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

// POST /api/upload/presigned-urls-bulk - Get presigned URLs for albums/EPs with multiple audio files
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
    const { 
      imageFileName, 
      imageFileType,
      audioFiles // Array of { fileName, fileType }
    } = body;

    // Validate required fields first
    if (!imageFileName || !imageFileType) {
      return NextResponse.json(
        { error: "imageFileName and imageFileType are required" },
        { status: 400 }
      );
    }

    if (!audioFiles || !Array.isArray(audioFiles) || audioFiles.length === 0) {
      return NextResponse.json(
        { error: "audioFiles array is required and must not be empty" },
        { status: 400 }
      );
    }

    const results: any = {};

    // Generate presigned URL for cover image (required)
    const imageCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: imageFileName,
      ContentType: imageFileType,
    //   ACL: 'public-read',
    });

    const imageUploadURL = await getSignedUrl(s3Client, imageCommand, { expiresIn: 3600 });
    const imageFileURL = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${imageFileName}`;

    results.image = {
      uploadURL: imageUploadURL,
      fileURL: imageFileURL,
    };

    // Generate presigned URLs for multiple audio files (required)
    results.audioFiles = await Promise.all(
      audioFiles.map(async ({ fileName, fileType }: { fileName: string; fileType: string }) => {
        if (!fileName || !fileType) {
          throw new Error("Each audio file must have fileName and fileType");
        }

        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileName,
          ContentType: fileType,
        //   ACL: 'public-read',
        });

        const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        const fileURL = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;

        return {
          uploadURL,
          fileURL,
          fileName,
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URLs" },
      { status: 500 }
    );
  }
}

