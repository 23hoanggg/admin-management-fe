import path from "path";
import sharp from "sharp";
import { ImageInfo } from "../types/shelf";

export async function getImageMetadata(imageName: string): Promise<ImageInfo> {
  const imagePath = path.join(process.cwd(), "public", "images", imageName);

  const metadata = await sharp(imagePath).metadata();

  return {
    src: `/api/images/${imageName}`,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}
