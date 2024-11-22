// download-yt-dlp.js
const path = require('path');
const { getYtDlpBinary } = require('youtube-dl-exec');

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
