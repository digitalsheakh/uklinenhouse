import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

/**
 * Image upload (admin only). Saves to /public/uploads and returns the URL.
 * NOTE: local disk works in development. For production hosting (e.g. Vercel),
 * switch this to a cloud store such as Cloudinary, Vercel Blob, or S3.
 */
export async function POST(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const base = slugify(path.basename(file.name, ext)) || "image";
    const filename = `${base}-${Date.now().toString(36)}${ext}`;
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
