import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'favicon.png');
const file = fs.readFileSync(filePath);
const base64 = file.toString('base64');
console.log(`data:image/png;base64,${base64}`);
