import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to handle keyword search
app.post('/search-keywords', (req, res) => {
    const { keywords, directory } = req.body;

    if (!keywords || !directory) {
        return res.status(400).json({ error: 'Keywords and directory are required.' });
    }

    const keywordsFound = [];
    const keywordsFileName = [];
    const keywordsNotFound = new Set(keywords);

    function searchInDirectory(dir) {
        console.info(`Searching in directory: ${dir}`);
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // Skip directories starting with a dot or node_modules
                if (file.startsWith('.') || file === 'node_modules') {
                    continue;
                }
                searchInDirectory(filePath);
            } else if (stats.isFile()) {
                const content = fs.readFileSync(filePath, 'utf-8');
                
                for (const keyword of keywords) {
                    if (content.includes(keyword) || content.includes(keyword.toUpperCase()) || content.includes(keyword.toLowerCase())) {
                        console.info(`Found: ${keyword} bytes`);
                        keywordsFound.push(keyword);
                        keywordsFileName.push(filePath);
                        keywordsNotFound.delete(keyword);
                    }
                }
            }
        }
    }

    try {
        searchInDirectory(directory);
        res.json({ keywordsFound,keywordsFileName, keywordsNotFound: Array.from(keywordsNotFound) });
    } catch (error) {
        res.status(500).json({ error: 'Error reading directory or files.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});