import StravaWeekCalendar from "../../strava/components/StravaWeekCalendar";
import WeekInRoastsRoast from "../components/WeekInRoastsRoast";
import { WeekProvider } from "../context/WeekContext";

export default function WeekInRoasts() {
  return (
    <div style={styles.container}>
        <WeekProvider>
          <div style={styles.pageContent}>
            <div style={styles.section}>
              <WeekInRoastsRoast />
            </div>

            <div style={styles.section}>
              <StravaWeekCalendar />
            </div>
          </div>
        </WeekProvider>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(to bottom right, #fff7ed, #fef2f2)',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  pageContent: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '16px',
  },
};