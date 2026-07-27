import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '..', 'node_modules', '@excalidraw', 'excalidraw', 'dist', 'dev', 'locales');

if (!fs.existsSync(localesDir)) {
  process.exit(0);
}

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.js'));
let fixed = 0;

for (const file of files) {
  const filePath = path.join(localesDir, file);
  const content = fs.readFileSync(filePath, 'utf8').trimEnd();
  if (!content.endsWith('}')) {
    fs.writeFileSync(filePath, content + '";\n};\n', 'utf8');
    fixed++;
  }
}

if (fixed > 0) {
  console.log(`[fix-excalidraw] Fixed ${fixed} corrupted locale file(s)`);
}
