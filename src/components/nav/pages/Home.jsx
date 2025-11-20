import { useContext, useEffect, useState } from 'react';
import StravaLoginStatusContext from '../../../contexts/StravaLoginStatusContext';
import StravaActivitiesPage from '../../content/StravaActivitiesPage';

export default function Home(props) {
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
        return <h1>Loading...</h1>;
    }

    if (activities.length > 0 && authData) {
        return <StravaActivitiesPage activities={activities} authData={authData} />;
    }

    return (
        <div className="text-center mt-5">
            <h1 className="display-4 fw-bold">Welcome to The Roast Coach</h1>
            <p className="lead mt-3">
            You're not logged in…which means I can't roast your athletic performance
            </p>
            <p className="text-muted">
            Go ahead, login. I promise to go easy on you (Probably)
            </p>
        </div>
    );
}