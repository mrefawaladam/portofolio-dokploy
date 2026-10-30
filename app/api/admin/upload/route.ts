import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Allowed MIME types
const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  // Documents
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "text/markdown",
  "application/json",
]);

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    // Retrieve all files attached with "files" or "file"
    const rawFiles = [
      ...formData.getAll("files"),
      ...formData.getAll("file"),
    ];

    if (!rawFiles || rawFiles.length === 0) {
      return NextResponse.json(
        { error: "No files provided for upload" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedFiles: Array<{
      originalName: string;
      filename: string;
      url: string;
      size: number;
      type: string;
      isImage: boolean;
    }> = [];

    for (const item of rawFiles) {
      if (typeof item === "string" || !(item instanceof File)) {
        continue;
      }

      if (item.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${item.name}" exceeds 25MB limit` },
          { status: 400 }
        );
      }

      // Check mime type (fallback to ext if empty)
      const mimeType = item.type || "application/octet-stream";
      const ext = path.extname(item.name).toLowerCase();
      
      const isAllowed = ALLOWED_MIME_TYPES.has(mimeType) || 
        [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".pdf", ".zip", ".md", ".txt"].includes(ext);

      if (!isAllowed) {
        return NextResponse.json(
          { error: `File type "${mimeType || ext}" for "${item.name}" is not supported` },
          { status: 400 }
        );
      }

      // Generate sanitized and collision-free filename
      const baseClean = path
        .basename(item.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 40);
      const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const finalFilename = `${baseClean}_${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadDir, finalFilename);

      // Write file buffer to public/uploads
      const bytes = await item.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      const isImage = mimeType.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"].includes(ext);

      uploadedFiles.push({
        originalName: item.name,
        filename: finalFilename,
        url: `/uploads/${finalFilename}`,
        size: item.size,
        type: mimeType,
        isImage,
      });
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: "No valid files were processed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file(s)" },
      { status: 500 }
    );
  }
}
