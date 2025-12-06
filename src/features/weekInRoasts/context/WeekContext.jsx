import { createContext, useContext, useState } from 'react';

const WeekContext = createContext();

export const WeekProvider = ({ children }) => {
  const [weekActivities, setWeekActivities] = useState([]);
  const [startOfWeek, setStartOfWeek] = useState(new Date());

  return (
    <WeekContext.Provider value={{ weekActivities, setWeekActivities, startOfWeek, setStartOfWeek }}>
      {children}
    </WeekContext.Provider>
  );
};

export const useWeek = () => useContext(WeekContext);