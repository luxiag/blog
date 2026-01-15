import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; file: string[] }> }
) {
  const resolvedParams = await params;
  const { category, file } = resolvedParams;
  const filePath = file.join('/');
  
  const postsDir = path.join(process.cwd(), 'posts');
  const imagePath = path.join(postsDir, category, 'images', filePath);

  if (!fs.existsSync(imagePath)) {
    return new NextResponse('Image not found', { status: 404 });
  }

  const content = fs.readFileSync(imagePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };

  return new NextResponse(content, {
    headers: {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
