#!/usr/bin/env node
// 复制博客图片到 public 目录

import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'posts');
const publicPostsDir = path.join(process.cwd(), 'public', 'posts');

function copyImages(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyImages(sourcePath, targetPath);
    } else if (entry.isFile() && /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(entry.name)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${entry.name}`);
    }
  }
}

function cleanPublicPosts() {
  if (fs.existsSync(publicPostsDir)) {
    fs.rmSync(publicPostsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(publicPostsDir, { recursive: true });
}

function main() {
  console.log('📸 Copying blog images to public folder...');
  
  cleanPublicPosts();

  const categories = fs.readdirSync(postsDir, { withFileTypes: true });
  
  for (const category of categories) {
    if (category.isDirectory()) {
      const imagesDir = path.join(postsDir, category.name, 'images');
      const targetDir = path.join(publicPostsDir, category.name, 'images');
      
      fs.mkdirSync(targetDir, { recursive: true });
      copyImages(imagesDir, targetDir);
    }
  }

  console.log('✅ Images copied successfully!');
}

main();
