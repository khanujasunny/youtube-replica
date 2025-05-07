import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFromYouTube } from '../api';
import SearchBar from './SearchBar';

const SearchResults = () => {
  const { query } = useParams();
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSearchResults = useCallback(
    async (pageToken = '') => {
      try {
        setIsLoading(true);
        const data = await fetchFromYouTube('search', {
          part: 'snippet',
          q: query,
          maxResults: 20,
          pageToken,
        });
        setVideos((prevVideos) => [...prevVideos, ...data.items]);
        setNextPageToken(data.nextPageToken);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    setVideos([]); // Clear previous results when query changes
    fetchSearchResults();
  }, [query, fetchSearchResults]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !isLoading &&
        nextPageToken
      ) {
        fetchSearchResults(nextPageToken);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchSearchResults, nextPageToken, isLoading]);

  return (
    <div>
      <SearchBar />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
        {videos
          .filter((video) => video.id.videoId) // Ensure only videos are displayed
          .map((video) => (
            <div key={video.id.videoId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/video/${video.id.videoId}`}>
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{video.snippet.title}</h3>
                <p className="text-sm text-gray-600 truncate">{video.snippet.channelTitle}</p>
              </div>
            </div>
          ))}
      </div>
      {isLoading && <div className="text-center py-4">Loading more results...</div>}
    </div>
  );
};

export default SearchResults;