import { useEffect, useState } from "react";

export default function StravaActivityRoast(props) {
    const [roast, setActivityRoast] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [stravaSent, setStravaSent] = useState(false);

    useEffect(() => {
        loadOrGenerateRoast();
    }, []);

    async function loadOrGenerateRoast() {
        await generateAIRoast();
    }

    async function generateAIRoast() {
        setLoading(true);
        setError(null);

        setActivityRoast("This is a roast");
        setLoading(false);
        
        // try {
        //     const pace = props.moving_time / (props.distance / 1000);
        //     const paceMin = Math.floor(pace / 60);
        //     const paceSec = Math.floor(pace % 60);
            
        //     const intensityLevel = "spicy and savage";
            
        //     const prompt = buildRoastPrompt(props, intensityLevel);

        //     const response = await fetch('https://strava-backend-eight.vercel.app/api/claude', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             messages: [
        //                 { role: 'user', content: prompt }
        //             ]
        //         })
        //     });

        //     const data = await response.json();

        //     if (!response.ok) {
        //         throw new Error(`API Error: ${response.status}`);
        //     }
            
        //     if (data.content && data.content[0]) {
        //         const newRoast = data.content[0].text;
        //         setActivityRoast(newRoast);
        //     } else {
        //         throw new Error("No response from AI");
        //     }
        // } catch (err) {
        //     console.error("AI roast generation failed:", err);
        //     setError("Failed to generate roast. Please check your API key and try again.");
        // } finally {
        //     setLoading(false);
        // }
    }

    function buildRoastPrompt(props, intensityLevel) {
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

            console.log('Refresh response status:', refreshResponse.status);
            
            if (!refreshResponse.ok) {
                const errorData = await refreshResponse.json();
                console.error('Refresh error:', errorData);
                throw new Error('Failed to refresh token: ' + JSON.stringify(errorData));
            }

            const refreshData = await refreshResponse.json();
            console.log('Refresh successful:', refreshData);
            
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

            console.log('Update response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Update error:', errorData);
                throw new Error(errorData.message || 'Failed to update activity');
            }

            setStravaSent(true);
            console.log('Activity updated successfully!');

        } catch (err) {
            console.error('Error updating Strava activity:', err);
        }
    }

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    return <div>
        {loading && <p style={{ fontStyle: 'italic', color: '#666' }}>🔥 Generating roast...</p>}
        {error && ( <p style={{ color: '#e74c3c', marginTop: '10px' }}>{error}</p> )}
        {roast ? <p style={{ 
            fontStyle: 'italic', 
            marginTop: '10px', 
            color: '#d35400',
            padding: '10px',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
            borderLeft: '4px solid #d35400'
        }}>
            {roast}
        </p> : <></>}
        <div>
            {!loading ?
                <button disabled={stravaSent}
                    onClick={sendRoastToStrava}
                    style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                    }}
                >
                Send to Strava
            </button> : <></>}
        </div>
    </div>
}