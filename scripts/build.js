#!/usr/bin/env node
// 构建脚本：先复制图片，再运行 Next.js 构建

const { spawn } = require('child_process');

function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function build() {
  console.log('📸 Copying blog images to public folder...');
  try {
    await runCommand('node', ['scripts/copy-images.mjs']);
    console.log('✅ Images copied successfully');
  } catch (error) {
    console.error('❌ Image copy failed:', error);
    process.exit(1);
  }

  console.log('🏗️  Running Next.js build...');
  try {
    await runCommand('npm', ['run', 'build']);
    console.log('✅ Next.js build completed');
  } catch (error) {
    console.error('❌ Next.js build failed:', error);
    process.exit(1);
  }
}

build();
