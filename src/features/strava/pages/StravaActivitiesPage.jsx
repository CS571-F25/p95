import StravaLoginStatusContext from "../context/StravaLoginStatusContext";
import StravaRoastActivityCard from "../components/StravaRoastActivityCard";
import { useContext, useEffect, useState } from 'react';
import { Spinner } from "react-bootstrap";

export default function StravaActivitiesPage() {
    const { authData } = useContext(StravaLoginStatusContext);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchActivities() {
            if (!authData || !authData.access_token) return;

            try {
                setLoading(true);

                const res = await fetch(
                    'https://www.strava.com/api/v3/athlete/activities?per_page=10',
                    {
                        headers: {
                            'Authorization': `Bearer ${authData.access_token}`
                        }
                    }
                );

                const data = await res.json();
                setActivities(data);
            } catch (err) {
                console.error('Error fetching activities:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchActivities();
    }, [authData]);

    if (loading) {
        return <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>;
    }

    return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '24px',
        width: '100%' 
    }}>
        {activities.map(x => (
            <StravaRoastActivityCard key={x.id} {...x} />
        ))}
    </div>
);

}