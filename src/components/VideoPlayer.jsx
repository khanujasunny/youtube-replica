import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFromYouTube } from '../api';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [videoDetails, setVideoDetails] = useState(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const data = await fetchFromYouTube('videos', {
          part: 'snippet,statistics',
          id: videoId,
        });
        setVideoDetails(data.items[0]);
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  if (!videoDetails) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={videoDetails.snippet.title}
          frameBorder="0"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      <h1 className="text-2xl font-bold mt-4">{videoDetails.snippet.title}</h1>
      <p className="text-gray-600 mt-2">{videoDetails.snippet.description}</p>
      <div className="mt-4">
        <span className="font-semibold">Views:</span> {videoDetails.statistics.viewCount}
      </div>
    </div>
  );
};

export default VideoPlayer;