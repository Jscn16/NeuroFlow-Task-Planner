const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist-standalone');
const BACKUP_ROOT = path.join(ROOT_DIR, 'backup-standalone');

// Helper to format date for folder name: YYYY-MM-DD_HH-mm-ss
const getTimestamp = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

// 1. Perform Backup if dist-standalone exists
if (fs.existsSync(DIST_DIR)) {
    console.log('Found existing dist-standalone. Creating backup...');

    if (!fs.existsSync(BACKUP_ROOT)) {
        fs.mkdirSync(BACKUP_ROOT, { recursive: true });
    }

    const timestamp = getTimestamp();
    const backupDir = path.join(BACKUP_ROOT, timestamp);

    // Rename dist-standalone to the backup path
    // This effectively moves it
    try {
        fs.renameSync(DIST_DIR, backupDir);
        console.log(`✓ Backup created at: ${backupDir}`);
    } catch (error) {
        console.error('Failed to create backup:', error);
        process.exit(1);
    }
} else {
    console.log('No existing dist-standalone found. Skipping backup.');
}

// 2. Run Vite Build
console.log('Running Vite build...');
try {
    execSync('npx vite build --config vite.standalone.config.ts', {
        cwd: ROOT_DIR,
        stdio: 'inherit'
    });
} catch (error) {
    console.error('Build failed.');
    process.exit(1);
}

// 3. Rename Output File - SKIPPED (User requested index.html)
// const indexHtml = path.join(DIST_DIR, 'index.html');
// const targetHtml = path.join(DIST_DIR, 'weekflux-standalone-V2.html');

// if (fs.existsSync(indexHtml)) {
//     try {
//         fs.renameSync(indexHtml, targetHtml);
//         console.log(`✓ Renamed output to: ${targetHtml}`);
//     } catch (error) {
//         console.error('Failed to rename output file:', error);
//         process.exit(1);
//     }
// } else {
//     console.error('Error: index.html not found in dist-standalone after build.');
//     process.exit(1);
// }

console.log('✓ Standalone build completed successfully.');
