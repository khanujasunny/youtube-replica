import axios from 'axios';

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchFromYouTube = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      params: {
        ...params,
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from YouTube API:', error);
    throw error;
  }
};