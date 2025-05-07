import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFromYouTube } from '../api';
import SearchBar from './SearchBar';

const Homepage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await fetchFromYouTube('videos', {
          part: 'snippet,contentDetails,statistics',
          chart: 'mostPopular',
          regionCode: 'US',
          maxResults: 20,
        });
        setVideos(data.items);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <SearchBar />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link to={`/video/${video.id}`}>
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
    </div>
  );
};

export default Homepage;