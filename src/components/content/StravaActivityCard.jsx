import StravaActivityRoast from "./StravaActivityRoast";
import { formatTime, formatDistance } from '../../utils'

export default function StravaActivityCard(props) {
    const intensity = props.intensity !== undefined ? props.intensity : 1;
    const safeMode = props.safeMode !== undefined ? props.safeMode : true;
    
    // Create unique key for this activity
    const activityKey = `roast:${props.activityId || `${props.name}-${props.start_date}`}`;

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDistance = (meters) => {
        if (!meters || meters <= 0) return "0 mi";

        const miles = meters / 1609.34; // meters → miles
        return `${miles.toFixed(2)} mi`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ 
                border: '1px solid #ccc', 
                borderRadius: '8px', 
                padding: '15px',
                backgroundColor: '#f9f9f9'
            }}>
                <h3>{props.name}</h3>
                <p><strong>Type:</strong> {props.type}</p>
                {props.distance ? <p><strong>Distance:</strong> {formatDistance(props.distance)}</p> : <></>}
                <p><strong>Time:</strong> {formatTime(props.moving_time)}</p>
                <p><strong>Date:</strong> {new Date(props.start_date).toLocaleDateString()}</p>
                <StravaActivityRoast {...props} />
            </div>
        </div>
    );
}