import { useContext, useState } from 'react';
import StravaLoginStatusContext from '../../../contexts/StravaLoginStatusContext';

export default function Home(props) {
    const { authData } = useContext(StravaLoginStatusContext);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchActivities = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(
                'https://www.strava.com/api/v3/athlete/activities?per_page=10',
                {
                    headers: {
                        'Authorization': `Bearer ${authData.access_token}`
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch activities');
            }
            
            const data = await response.json();
            setActivities(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching activities:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };
    
    return (
        <div style={{ padding: '20px' }}>
            <h1>Hello {authData.athlete.firstname}!</h1>
            
            <button onClick={fetchActivities} disabled={loading}>
                {loading ? 'Loading...' : 'Get My Activities'}
            </button>
            
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            {activities.length > 0 && (
                <div>
                    <h2>Recent Activities ({activities.length})</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {activities.map(activity => (
                            <div key={activity.id} style={{ 
                                border: '1px solid #ccc', 
                                borderRadius: '8px', 
                                padding: '15px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <h3>{activity.name}</h3>
                                <p><strong>Type:</strong> {activity.type}</p>
                                <p><strong>Distance:</strong> {(activity.distance / 1000).toFixed(2)} km</p>
                                <p><strong>Moving Time:</strong> {formatTime(activity.moving_time)}</p>
                                <p><strong>Date:</strong> {new Date(activity.start_date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}