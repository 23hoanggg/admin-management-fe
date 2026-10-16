import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ imageName: string }> },
) {
  try {
    const { imageName } = await params;
    const imagePath = path.join(process.cwd(), "public", "images", imageName);

    // Verify file exists
    await fs.access(imagePath);

    const image = await sharp(imagePath)
      .resize({ width: 600 })
      .avif({ quality: 50 })
      .toBuffer();

    return new Response(image, {
      headers: {
        "Content-Type": "image/avif",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return new Response("Image not found or processing error", { status: 404 });
  }
}
