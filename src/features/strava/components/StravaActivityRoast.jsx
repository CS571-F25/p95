import { useEffect, useState } from "react"
import { formatTime } from '../../../utils'

export default function StravaActivityRoast(props) {
    const [roast, setActivityRoast] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [stravaSent, setStravaSent] = useState(false);

    useEffect(() => {
        loadOrGenerateRoast();
    }, []);

    /**
     * Handles getting a roast for an activity either through
     * localStorage or generating a new one
     */
    async function loadOrGenerateRoast() {
        // Try to load from localStorage first
        const cachedRoast = loadRoastFromCache(props.id);
        
        if (cachedRoast) {
            setActivityRoast(cachedRoast);
        } else {
            // Generate new roast if not in cache
            await generateAIRoast();
        }
    }

    /**
     * Returns roast from cache if available
     * @param activityId id of activity to find in cache
     * @returns Roast associated with cache
     */
    function loadRoastFromCache(activityId) {
        try {
            const cacheKey = `strava_roast_${activityId}`;
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

    /**
     * Saves roast to cache with unique key
     * @param activityId id of activity used for unique key
     * @param roastText roast to be saved with activityId
     */
    function saveRoastToCache(activityId, roastText) {
        try {
            const cacheKey = `strava_roast_${activityId}`;
            const cacheData = {
                roast: roastText,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (err) {
            console.error('Error saving to localStorage:', err);
        }
    }

    /**
     * Generates an AI roast using Claude API from Vercel
     */
    async function generateAIRoast() {
        setLoading(true);
        setError(null);
        
        try {
            const intensity = getIntensityLevel();
            const prompt = buildRoastPrompt(intensity);

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
                setActivityRoast(newRoast);
                // Save to cache after successful generation
                saveRoastToCache(props.id, newRoast);
            } else {
                throw new Error("No response from AI");
            }
        } catch (err) {
            console.error("AI roast generation failed:", err);
            setError("Failed to generate roast. Please check your API key and try again.");
        } finally {
            setLoading(false);
        }
    }

    function getIntensityLevel() {
        let storedValue = localStorage.getItem('heatLevel');

        return storedValue ?? 3;
    }

    /**
     * Builds roast type according to intensity level and data provided for the activity
     * @param intensityLevel is how intensse Claude should make the roast
     * @returns 
     */
    function buildRoastPrompt(heatLevel) {
        const intensity = {
            1: "lighthearted and playful",
            2: "moderately spicy and cheeky",
            3: "boldly sarcastic and edgy",
            4: "savage and ruthlessly funny",
            5: "absolutely unhinged and chaotic"
        };

        const intensityLevel = intensity[heatLevel];

        const metrics = [];
        const context = [];

        // Activity type and name for context
        const activityType = props.sport_type || "mystery activity";
        const activityName = props.name || "Untitled Activity";

        if(props.device_name) {
            context.push(`Device Used: ${props.device_name}`);
        }

        // Distance and pace (crucial for runs/rides)
        if (props.distance > 0) {
            const distanceMiles = (props.distance * 0.000621371).toFixed(2);
            metrics.push(`Distance: ${distanceMiles} miles`);
            
            // Calculate and add pace for context (min/mile)
            if (props.moving_time > 0) {
                const paceMinPerMile = props.moving_time / (props.distance * 0.000621371) / 60;
                const paceMin = Math.floor(paceMinPerMile);
                const paceSec = Math.round((paceMinPerMile - paceMin) * 60);
                metrics.push(`Pace: ${paceMin}:${paceSec.toString().padStart(2, "0")}/mile`);
                
                // Add speed in mph for better context
                const speedMph = (props.distance * 0.000621371) / (props.moving_time / 3600);
                metrics.push(`Average speed: ${speedMph.toFixed(1)} mph`);
            }
        }

        // Time metrics - key for roasting effort
        if (props.moving_time > 0) {
            metrics.push(`Moving time: ${formatTime(props.moving_time)}`);
        }
        
        // Time stopped (great roast material!)
        if (props.elapsed_time && props.elapsed_time > props.moving_time) {
            const stoppedTime = props.elapsed_time - props.moving_time;
            context.push(`Stopped for ${formatTime(stoppedTime)} during the activity`);
        }

        // Elevation (prime roast territory) - convert to feet
        if (props.total_elevation_gain !== undefined) {
            const elevationFeet = Math.round(props.total_elevation_gain * 3.28084);
            metrics.push(`Elevation gain: ${elevationFeet} ft`);
            if (props.total_elevation_gain === 0 && props.distance > 1000) {
                context.push("Found the flattest route possible");
            }
        }

        // Heart rate (effort indicator)
        if (props.average_heartrate) {
            metrics.push(`Average heart rate: ${props.average_heartrate} bpm`);
            if (props.max_heartrate) {
                metrics.push(`Max heart rate: ${props.max_heartrate} bpm`);
            }
        }

        // Calories/Energy
        if (props.kilojoules) {
            const calories = Math.round(props.kilojoules * 0.239); // Convert kJ to kcal
            metrics.push(`Calories burned: ${calories} kcal`);
        } else if (props.calories) {
            metrics.push(`Calories burned: ${Math.round(props.calories)} kcal`);
        }

        // Max speed (good for bragging vs reality check)
        if (props.max_speed > 0) {
            const maxSpeedMph = (props.max_speed * 2.23694).toFixed(1);
            metrics.push(`Max speed: ${maxSpeedMph} mph`);
        }

        // Kudos count (social validation... or lack thereof)
        if (props.kudos_count !== undefined) {
            context.push(`Received ${props.kudos_count} kudos`);
        }

        // Achievement count
        if (props.achievement_count !== undefined && props.achievement_count > 0) {
            context.push(`Earned ${props.achievement_count} achievement${props.achievement_count > 1 ? 's' : ''}`);
        }

        // Build the prompt
        return `You are a witty Strava activity roaster. Create a funny, ${intensityLevel} roast for this ${activityType} activity titled "${activityName}".

        **Activity Stats:**
        ${metrics.join('\n')}

        ${context.length > 0 ? `**Additional Context:**\n${context.join('\n')}` : ''}

        **Instructions:**
        - Keep it 1-2 sentences maximum
        - Be sharp, creative, and specific to the stats
        - Focus on the most roast-worthy aspect (slow pace, excessive breaks, flat route, low effort, etc.)
        - Make it funny but not mean-spirited
        - Reference specific numbers when they're embarrassing or impressive`;
    }

    /**
     * Sends a roast to strava as a description
     * @returns 
     */
    async function sendRoastToStrava() {
        if (!roast) return;

        try {
            // First, refresh the access token
            const refreshResponse = await fetch('https://strava-backend-eight.vercel.app/api/strava', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refresh_token: authData.refresh_token
                })
            });
            
            if (!refreshResponse.ok) {
                const errorData = await refreshResponse.json();
                throw new Error('Failed to refresh token: ' + JSON.stringify(errorData));
            }

            const refreshData = await refreshResponse.json();
            
            const newAccessToken = refreshData.access_token;

            // Update authData with new token
            setAuthData({
                ...authData,
                access_token: newAccessToken,
                refresh_token: refreshData.refresh_token
            });

            // Now update the activity with the fresh token
            const response = await fetch('https://strava-backend-eight.vercel.app/api/strava', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_token: newAccessToken,
                    id: props.id,
                    description: roast
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update activity');
            }

            setStravaSent(true);

        } catch (err) {
            console.error('Error updating Strava activity:', err);
        }
    }

    return <div style={styles.roastBox}>
        <div style={styles.roastContent}>
            <div style={{ flex: 1 }}>
                <div style={styles.roastLabel}>
                    <span>AI Roast</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {!loading && (
                            <button
                                disabled={stravaSent}
                                onClick={sendRoastToStrava}
                                style={styles.stravaButton}
                            >
                                Send to Strava
                            </button>
                        )}
                    </div>
                </div>

                {loading && <p style={{ fontStyle: 'italic', color: '#666' }}>🔥 Generating roast...</p>}
                {error && <p style={{ color: 'white', marginTop: '10px' }}>{error}</p>}
                {roast && <p style={styles.roastText}>{roast}</p>}
            </div>
        </div>
    </div>;
}

const styles = {
    roastBox: {
        background: 'linear-gradient(to right, #fff7ed, #fef2f2)',
        borderRadius: '12px',
        padding: '16px',
        border: '2px solid #fed7aa'
    },
    roastContent: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start'
    },
    roastLabel: {
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#ea580c',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    roastText: {
        color: '#374151',
        fontSize: '14px',
        lineHeight: '1.6',
        fontStyle: 'italic'
    },
    stravaButton: {
        padding: '6px 12px',
        fontSize: '12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer'
    },
    regenerateButton: {
        padding: '6px 10px',
        fontSize: '12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer'
    }
};