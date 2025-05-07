import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFromYouTube } from '../api';

const SearchResults = () => {
  const { query } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const data = await fetchFromYouTube('search', {
          part: 'snippet',
          q: query,
          maxResults: 20,
        });
        setVideos(data.items);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
  );
};

export default SearchResults;