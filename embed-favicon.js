import fs from 'fs';
import path from 'path';

const faviconPath = path.join(process.cwd(), 'public', 'favicon.png');
const indexPath = path.join(process.cwd(), 'index.html');

try {
    const favicon = fs.readFileSync(faviconPath);
    const base64 = favicon.toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;

    let html = fs.readFileSync(indexPath, 'utf-8');

    // Replace the link tag or just the href
    // We look for: <link rel="icon" type="image/png" href="/favicon.png" />
    // Or just href="/favicon.png"

    if (html.includes('href="/favicon.png"')) {
        html = html.replace('href="/favicon.png"', `href="${dataUri}"`);
        fs.writeFileSync(indexPath, html);
        console.log('Successfully embedded favicon into index.html');
    } else {
        console.log('Could not find favicon link in index.html');
    }
} catch (error) {
    console.error('Error embedding favicon:', error);
    process.exit(1);
}
