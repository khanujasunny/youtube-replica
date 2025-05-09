import React, { useState } from 'react';
import axios from 'axios';
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
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KeywordSearch;