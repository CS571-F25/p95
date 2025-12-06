import { createContext, useContext, useState } from 'react';

const WeekContext = createContext();

export const WeekProvider = ({ children, authData }) => {
  const [weeks, setWeeks] = useState({});
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWeek = async (startOfWeek) => {
    const key = startOfWeek.toISOString().slice(0, 10);

    // Check cache first
    if (weeks[key]) {
      setCurrentWeek(weeks[key]);
      return weeks[key];
    }
    
    // Fetch if not cached
    setLoading(true);
    try {
      const activities = await fetchActivitiesForWeek(startOfWeek, authData);

      const weekData = {
        startOfWeek,
        activities
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

  return (
    <WeekContext.Provider
      value={{ 
        currentWeek,
        loading,
        getWeek 
      }}
    >
      {children}
    </WeekContext.Provider>
  );
};

export const useWeek = () => useContext(WeekContext);

// Fetch activities from Strava API
async function fetchActivitiesForWeek(startOfWeek, authData) {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const after = Math.floor(startOfWeek.getTime() / 1000);
  const before = Math.floor(endOfWeek.getTime() / 1000);

  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${before}`,
      {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}