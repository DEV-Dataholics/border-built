import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images');
const supportedExts = ['.jpg', '.jpeg', '.png', '.webp'];

async function optimizeImages() {
    console.log(`🔍 Scanning directory: ${imagesDir}`);

    if (!fs.existsSync(imagesDir)) {
        console.error('❌ Directory not found!');
        return;
    }

    const files = fs.readdirSync(imagesDir);
    let count = 0;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!supportedExts.includes(ext)) continue;

        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);

        // Skip small files (< 200KB) unless explicitly big dimensions? 
        // Actually, let's optimize everything > 500KB or > 1920px width
        if (stats.size < 500 * 1024) {
            console.log(`⏩ Skipping small file: ${file} (${(stats.size / 1024).toFixed(0)}KB)`);
            continue;
        }

        console.log(`⚡ Processing: ${file} (${(stats.size / 1024 / 1024).toFixed(2)}MB)...`);

        try {
            const buffer = fs.readFileSync(filePath);
            const image = sharp(buffer);
            const metadata = await image.metadata();

            // Resize if width > 1920
            let pipeline = image;
            if (metadata.width > 1920) {
                pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
            }

            // Compress
            if (ext === '.png') {
                pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
            } else {
                pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
            }

            const processedBuffer = await pipeline.toBuffer();

            // Save ONLY if size reduced
            if (processedBuffer.length < stats.size) {
                fs.writeFileSync(filePath, processedBuffer);
                console.log(`✅ Optimized: ${file} -> ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`);
                count++;
            } else {
                console.log(`⚠️ Optimization didn't reduce size for ${file}, skipping write.`);
            }

        } catch (err) {
            console.error(`❌ Error processing ${file}:`, err);
        }
    }

    console.log(`\n🎉 Optimization complete! Processed ${count} images.`);
}

optimizeImages();
