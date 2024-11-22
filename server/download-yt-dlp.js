import path from 'path';
import { fileURLToPath } from 'url';
import { getYtDlpBinary } from 'youtube-dl-exec';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    try {
        const ytDlpPath = path.resolve(__dirname, 'yt-dlp');
        await getYtDlpBinary(ytDlpPath);
        console.log('yt-dlp binary downloaded successfully');
    } catch (error) {
        console.error('Failed to download yt-dlp binary:', error);
        process.exit(1);
    }
})();
