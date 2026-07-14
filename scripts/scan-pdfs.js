import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function scanPdfDirectory() {
  const pdfDir = path.join(process.cwd(), 'public', 'pdf');
  const outputFile = path.join(process.cwd(), 'public', 'json', 'pdf-list.json');
  
  // Ensure json directory exists
  const jsonDir = path.join(process.cwd(), 'public', 'json');
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }
  
  // Check if pdf directory exists
  if (!fs.existsSync(pdfDir)) {
    console.log('public/pdf directory does not exist, creating empty pdf-list.json');
    fs.writeFileSync(outputFile, JSON.stringify({ pdfs: [] }, null, 2));
    return;
  }
  
  // Read directory
  const files = fs.readdirSync(pdfDir);
  
  // Filter PDF files and get stats
  const pdfFiles = files
    .filter(file => file.toLowerCase().endsWith('.pdf'))
    .map(file => {
      const filePath = path.join(pdfDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        id: `public_${file.replace(/\.pdf$/i, '')}`,
        name: file,
        url: `/blog/pdf/${file}`,
        size: stats.size,
        addedAt: stats.mtime.getTime(),
        isPublic: true
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Write JSON file
  fs.writeFileSync(outputFile, JSON.stringify({ pdfs: pdfFiles }, null, 2));
  console.log(`Found ${pdfFiles.length} PDF(s) in public/pdf directory`);
  console.log(`Generated ${outputFile}`);
  
  // Sync pdf.worker.min.mjs to public/js
  syncPdfWorker();
}

function syncPdfWorker() {
  const source = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
  const targetDir = path.join(process.cwd(), 'public', 'js');
  const target = path.join(targetDir, 'pdf.worker.min.mjs');

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(source)) {
      const sourceContent = fs.readFileSync(source);
      const targetContent = fs.existsSync(target) ? fs.readFileSync(target) : null;

      if (!targetContent || !sourceContent.equals(targetContent)) {
        fs.writeFileSync(target, sourceContent);
        console.log(`✅ Synced pdf.worker.min.mjs to ${target}`);
      } else {
        console.log(`ℹ️ pdf.worker.min.mjs is already up to date`);
      }
    } else {
      console.warn(`⚠️ Could not find source worker at ${source}`);
    }
  } catch (err) {
    console.error(`❌ Failed to sync PDF worker: ${err.message}`);
  }
}

scanPdfDirectory();
