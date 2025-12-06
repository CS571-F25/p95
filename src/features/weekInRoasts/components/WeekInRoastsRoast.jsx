import { useState, useEffect } from "react";
import { formatDistance, formatTime } from "../../../utils";
import { useWeek } from "../context/WeekContext";

export default function WeekInRoastsRoast() {
  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState("");
  const {weekActivities, startOfWeek} = useWeek();

  useEffect(() => {
    loadOrGenerateRoast();
  }, [startOfWeek, weekActivities]);

  async function loadOrGenerateRoast() {
    if(weekActivities.length == 0) return;

    // Try to load from localStorage first
    const cachedRoast = loadRoastFromCache(startOfWeek);
    
    if (cachedRoast) {
        setRoast(cachedRoast);
    } else {
        // Generate new roast if not in cache
        await generateAIRoast();
    }
  }

  function loadRoastFromCache(week) {
      try {
          const cacheKey = `strava_week_roast_${week.toISOString().slice(0, 10)}`;
          const cached = localStorage.getItem(cacheKey);
          
          if (!cached) return null;
          
          // Parse the cached data
          const cacheData = JSON.parse(cached);
          
          return cacheData.roast;
      } catch (err) {
          console.error('Error reading from localStorage:', err);
          return null;
      }
  }

  function saveRoastToCache(week, roastText) {
      try {
          const cacheKey = `strava_week_roast_${week.toISOString().slice(0, 10)}`;
          const cacheData = {
              roast: roastText,
              timestamp: Date.now()
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (err) {
          console.error('Error saving to localStorage:', err);
      }
  }

  async function generateAIRoast() {
      setLoading(true);
      
      try {
          const intensityLevel = "spicy and savage";
          
          const prompt = buildRoastPrompt(weekActivities, intensityLevel);

          console.log(prompt);

          const response = await fetch('https://strava-backend-eight.vercel.app/api/claude', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  messages: [
                      { role: 'user', content: prompt }
                  ]
              })
          });

          const data = await response.json();

          if (!response.ok) {
              throw new Error(`API Error: ${response.status}`);
          }
          
          if (data.content && data.content[0]) {
              const newRoast = data.content[0].text;
              setRoast(newRoast);

              // Save to cache after successful generation
              saveRoastToCache(startOfWeek, newRoast);
          } else {
              throw new Error("No response from AI");
          }
      } catch (err) {
          console.error("AI roast generation failed:", err);
      } finally {
          setLoading(false);
      }
  }

  function buildRoastPrompt(weekActivities) {
    if (!weekActivities || weekActivities.length === 0) {
      return `Roast someone who claims to be an athlete but didn't record a single activity this week. Be brutal but funny.`;
    }

    const totalDistance = weekActivities.reduce((sum, a) => sum + (a.distance || 0), 0);
    const totalTime = weekActivities.reduce((sum, a) => sum + (a.moving_time || 0), 0);
    const activityTypes = weekActivities.map(a => a.sport_type).join(', ');
    
    const weekActivitiesSummary = weekActivities.map(a => 
      `- ${a.sport_type}: ${a.distance ? formatDistance(a.distance) : ""} ${formatTime(a.moving_time)}`
    ).join('\n');

    return `You are a brutally honest fitness coach with a sharp wit. Roast this person's week of Strava weekActivities. Be funny, creative, and savage but not genuinely mean-spirited.

    Here's what they did this week:
    ${weekActivitiesSummary}

    Total: ${formatDistance(totalDistance)} across ${weekActivities.length} weekActivities
    Activity types: ${activityTypes}

    Give them a hilarious roast about their performance, effort level, pace, or frequency. Make it personal and specific to their actual stats. End with one piece of backhanded "advice".
    **Instructions:**
        - Keep it 1-2 sentences maximum
        - Be sharp, creative, and specific to the stats
        - Focus on the most roast-worthy aspect (slow pace, excessive breaks, flat route, low effort, etc.)
        - Make it funny but not mean-spirited
        - Reference specific numbers when they're embarrassing or impressive`;
  }

  return (
    <div key={1} style={styles.roastCard}>
      <h1 style={styles.title}>
        ☕ This Week’s Roast
      </h1>

      <p style={styles.subtitle}>
        A brutally honest breakdown of your training week
      </p>

      <div style={styles.roastBody}>
        {loading ? <p>Loading...</p>
          : <p style={styles.roastText}>
              {roast}
            </p>
          }
      </div>
    </div>
  );
}

const styles = {
  roastCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    textAlign: 'center',
  },

  title: {
    margin: '0 0 4px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
  },

  subtitle: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '16px',
  },

  roastBody: {
    background: '#fff7ed',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #fde68a',
  },

  roastText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#374151',
    margin: 0,
  }
};