import { createContext, useContext, useState } from 'react';

const WeekContext = createContext();

export const WeekProvider = ({ children }) => {
  const [weeks, setWeeks] = useState({});
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  const getWeek = async (startOfWeek) => {
    const key = startOfWeek.toISOString().slice(0, 10);

    // Check cache first
    if (weeks[key]) {
      setCurrentWeek(weeks[key]);
      return weeks[key];
    }
    
    // Don't fetch if rate limited
    if (rateLimitInfo) {
      return null;
    }
    
    // Fetch if not cached
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchActivitiesForWeek(startOfWeek);

      // Handle rate limit
      if (result.rateLimited) {
        setRateLimitInfo(result.rateLimitInfo);
        return null;
      }

      // Handle error
      if (result.error) {
        setError(result.error);
        return null;
      }

      const weekData = {
        startOfWeek,
        activities: result.activities
      };

      // Save to cache
      setWeeks(prev => ({
        ...prev,
        [key]: weekData
      }));

      setCurrentWeek(weekData);
      return weekData;
    } finally {
      setLoading(false);
    }
  };

  const clearRateLimit = () => {
    setRateLimitInfo(null);
  };

  return (
    <WeekContext.Provider
      value={{ 
        currentWeek,
        loading,
        error,
        rateLimitInfo,
        getWeek,
        clearRateLimit
      }}
    >
      {children}
    </WeekContext.Provider>
  );
};

export const useWeek = () => useContext(WeekContext);

// Fetch activities from backend (which reads token from cookies)
async function fetchActivitiesForWeek(startOfWeek) {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const after = Math.floor(startOfWeek.getTime() / 1000);
  const before = Math.floor(endOfWeek.getTime() / 1000);

  try {
    const response = await fetch(
      `https://strava-backend-eight.vercel.app/api/strava?after=${after}&before=${before}`,
      {
        credentials: 'include' // Send cookies with request
      }
    );

    // Handle rate limiting
    if (response.status === 429) {
      const data = await response.json();
      return {
        rateLimited: true,
        rateLimitInfo: {
          message: data.message,
          resetAt: data.resetAt
        }
      };
    }

    if (!response.ok) {
      return {
        error: `Backend API error: ${response.status}`,
        activities: []
      };
    }

    const activities = await response.json();
    return { activities };
    
  } catch (error) {
    console.error('Error fetching activities:', error);
    return {
      error: error.message,
      activities: []
    };
  }
}