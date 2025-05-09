import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './KeywordSearch.css'; // Importing a CSS file for styling

const KeywordSearch = () => {
    const [keywords, setKeywords] = useState('');
    const [directory, setDirectory] = useState('');
    const [results, setResults] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/search-keywords', {
                keywords: keywords.split('\n').map((kw) => kw.trim()).filter((kw) => kw),
                directory,
            });

            setResults(response.data);
        } catch (error) {
            console.error('Error searching keywords:', error);
            setResults({ error: 'Failed to search keywords. Please try again.' });
        }
    };

    const handleExportCSV = () => {
        if (!results) return;

        const csvRows = [
            ['Keyword', 'Status', 'File Name'],
            ...results.keywordsFound.map((keyword, index) => [keyword, 'Found', results.keywordsFileName[index] || 'Unknown']),
            ...results.keywordsNotFound.map((keyword) => [keyword, 'Not Found', '-']),
        ];

        const csvContent = csvRows
            .map((row) => row.map((cell) => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'keyword_search_results.csv');
    };

    return (
        <div className="keyword-search-container">
            <h1 className="keyword-search-title">Keyword Search</h1>
            <form onSubmit={handleSubmit} className="keyword-search-form">
                <div className="form-group">
                    <label>Keywords (one per line):</label>
                    <textarea
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        rows="10"
                        cols="50"
                        className="textarea-keywords"
                    />
                </div>
                <div className="form-group">
                    <label>Directory Path:</label>
                    <input
                        type="text"
                        value={directory}
                        onChange={(e) => setDirectory(e.target.value)}
                        className="input-directory"
                    />
                </div>
                <button type="submit" className="btn-submit">Search</button>
            </form>

            {results && (
                <div className="results-container">
                    {results.error ? (
                        <p className="error-message">{results.error}</p>
                    ) : (
                        <div>
                            <button onClick={handleExportCSV} className="btn-export">Export as CSV</button>
                            <h2>Results</h2>
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        <th>Keyword</th>
                                        <th>Status</th>
                                        <th>File Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.keywordsFound.map((keyword, index) => (
                                        <tr key={index}>
                                            <td>{keyword}</td>
                                            <td>Found</td>
                                            <td>{results.keywordsFileName[index]}</td>
                                        </tr>
                                    ))}
                                    {results.keywordsNotFound.map((keyword, index) => (
                                        <tr key={index}>
                                            <td>{keyword}</td>
                                            <td>Not Found</td>
                                            <td>-</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={handleExportCSV} className="btn-export">Export as CSV</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KeywordSearch;