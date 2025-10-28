// API Configuration
// Automatically detects environment and uses the correct API URL

const getApiUrl = () => {
  // If REACT_APP_API_URL is set in environment variables, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Check if running in production (Vercel)
  if (process.env.NODE_ENV === 'production') {
    // Use your deployed backend URL here
    // Replace this with your actual backend URL once deployed
    return 'https://your-backend-url.onrender.com/api';
  }
  
  // Default to localhost for development
  return 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();

export default API_URL;
