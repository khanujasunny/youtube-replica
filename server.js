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
    const keywordsNotFound = [];

    try {
        const files = fs.readdirSync(directory);

        keywords.forEach((keyword) => {
            let found = false;

            files.forEach((file) => {
                const filePath = path.join(directory, file);
                if (fs.statSync(filePath).isFile()) {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    if (content.includes(keyword)) {
                        found = true;
                    }
                }
            });

            if (found) {
                keywordsFound.push(keyword);
            } else {
                keywordsNotFound.push(keyword);
            }
        });

        res.json({ keywordsFound, keywordsNotFound });
    } catch (error) {
        res.status(500).json({ error: 'Error reading directory or files.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});