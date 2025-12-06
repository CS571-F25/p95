import { useState, useEffect } from "react";
import { formatDistance, formatTime } from "../../../utils";
import { useWeek } from "../context/WeekContext";

export default function WeekInRoastsRoast() {
  const [roastLoading, setRoastLoading] = useState(false);
  const [roast, setRoast] = useState("");
  const { currentWeek, loading } = useWeek();

  useEffect(() => {
    if (currentWeek) {
      loadOrGenerateRoast();
    }
  }, [currentWeek]);

  async function loadOrGenerateRoast() {
    if (!currentWeek?.activities || currentWeek.activities.length === 0) {
      setRoast("");
      return;
    }

    // Try to load from localStorage first
    const cachedRoast = loadRoastFromCache(currentWeek.startOfWeek);
    
    if (cachedRoast) {
      setRoast(cachedRoast);
    } else {
      // Generate new roast if not in cache
      await generateAIRoast();
    }
  }

  function loadRoastFromCache(startOfWeek) {
    try {
      const cacheKey = `strava_week_roast_${startOfWeek.toISOString().slice(0, 10)}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;
      
      const cacheData = JSON.parse(cached);
      return cacheData.roast;
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return null;
    }
  }

  function saveRoastToCache(startOfWeek, roastText) {
    try {
      const cacheKey = `strava_week_roast_${startOfWeek.toISOString().slice(0, 10)}`;
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
    if (!currentWeek?.activities) return;

    setRoastLoading(true);
    
    try {
      const prompt = buildRoastPrompt(currentWeek.activities);

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
        saveRoastToCache(currentWeek.startOfWeek, newRoast);
      } else {
        throw new Error("No response from AI");
      }
    } catch (err) {
      console.error("AI roast generation failed:", err);
      setRoast("Failed to generate roast. Try again later.");
    } finally {
      setRoastLoading(false);
    }
  }

  function buildRoastPrompt(activities) {
    if (!activities || activities.length === 0) {
      return `Roast someone who claims to be an athlete but didn't record a single activity this week. Be brutal but funny.`;
    }

    const totalDistance = activities.reduce((sum, a) => sum + (a.distance || 0), 0);
    const totalTime = activities.reduce((sum, a) => sum + (a.moving_time || 0), 0);
    const activityTypes = activities.map(a => a.sport_type).join(', ');
    
    const activitiesSummary = activities.map(a => 
      `- ${a.sport_type}: ${a.distance ? formatDistance(a.distance) : ""} ${formatTime(a.moving_time)}`
    ).join('\n');

    return `You are a brutally honest fitness coach with a sharp wit. Roast this person's week of Strava activities. Be funny, creative, and savage but not genuinely mean-spirited.

Here's what they did this week:
${activitiesSummary}

Total: ${formatDistance(totalDistance)} across ${activities.length} activities
Activity types: ${activityTypes}

Give them a hilarious roast about their performance, effort level, pace, or frequency. Make it personal and specific to their actual stats. End with one piece of backhanded "advice".
**Instructions:**
    - Keep it 1-2 sentences maximum
    - Be sharp, creative, and specific to the stats
    - Focus on the most roast-worthy aspect (slow pace, excessive breaks, flat route, low effort, etc.)
    - Make it funny but not mean-spirited
    - Reference specific numbers when they're embarrassing or impressive`;
  }

  const isLoading = loading || roastLoading;

  return (
    <div style={styles.roastCard}>
      <h1 style={styles.title}>
        ☕ This Week's Roast
      </h1>

      <p style={styles.subtitle}>
        A brutally honest breakdown of your training week
      </p>

      <div style={styles.roastBody}>
        {isLoading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : roast ? (
          <p style={styles.roastText}>{roast}</p>
        ) : (
          <p style={styles.emptyText}>No activities to roast this week!</p>
        )}
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
  },

  loadingText: {
    fontSize: '14px',
    color: '#6b7280',
    fontStyle: 'italic',
    margin: 0,
  },

  emptyText: {
    fontSize: '14px',
    color: '#9ca3af',
    fontStyle: 'italic',
    margin: 0,
  }
};