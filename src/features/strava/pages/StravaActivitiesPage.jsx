import StravaLoginStatusContext from "../context/StravaLoginStatusContext";
import StravaRoastActivityCard from "../components/StravaRoastActivityCard";
import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Spinner } from "react-bootstrap";

// Cache outside component to persist across unmounts
const activitiesCache = {
    data: [],
    page: 1,
    hasMore: true
};

export default function StravaActivitiesPage() {
    const { authData } = useContext(StravaLoginStatusContext);
    const [activities, setActivities] = useState(activitiesCache.data);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(activitiesCache.page);
    const [hasMore, setHasMore] = useState(activitiesCache.hasMore);
    const observer = useRef();

    const lastActivityRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        async function fetchActivities() {
            if (!authData || !hasMore) return;

            try {
                setLoading(true);

                const res = await fetch(
                    `https://strava-backend-eight.vercel.app/api/strava?per_page=10&page=${page}`,
                    {
                        credentials: 'include' // Send cookies with request
                    }
                );

                if (!res.ok) {
                    throw new Error(`Backend error: ${res.status}`);
                }

                const data = await res.json();
                
                if (data.length === 0) {
                    setHasMore(false);
                    activitiesCache.hasMore = false;
                } else {
                    setActivities(prev => {
                        const newActivities = [...prev, ...data];
                        activitiesCache.data = newActivities;
                        return newActivities;
                    });
                    activitiesCache.page = page;
                }
            } catch (err) {
                console.error('Error fetching activities:', err);
            } finally {
                setLoading(false);
            }
        }

        // Only fetch if we don't have data for this page already
        if (activities.length < page * 10) {
            fetchActivities();
        }
    }, [authData, page]);

    if (activities.length === 0 && loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '24px',
            width: '100%' 
        }}>
            {activities.map((x, index) => {
                if (activities.length === index + 1) {
                    return (
                        <div ref={lastActivityRef} key={x.id} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <StravaRoastActivityCard {...x} />
                        </div>
                    );
                } else {
                    return <StravaRoastActivityCard key={x.id} {...x} />;
                }
            })}
            
            {loading && (
                <div style={{ padding: '20px' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading more...</span>
                    </Spinner>
                </div>
            )}
            
            {!hasMore && activities.length > 0 && (
                <div style={{ padding: '20px', color: '#666' }}>
                    No more activities to load
                </div>
            )}
        </div>
    );
}