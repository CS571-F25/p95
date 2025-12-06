import { useState, useEffect, useContext } from 'react';
import { Col, Row, Container, Button } from 'react-bootstrap';
import StravaLoginStatusContext from '../context/StravaLoginStatusContext';
import StravaActivityCard from './StravaActivityCard';
import { useWeek } from '../../weekInRoasts/context/WeekContext';

export default function StravaWeekCalendar({onWeekActivitiesChange, onCurrentStartOfWeekChanged}) {
    const { authData } = useContext(StravaLoginStatusContext);
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [weekRange, setWeekRange] = useState({start_date: null, end_date: null});
    const {weekActivities, setWeekActivities, setStartOfWeek} = useWeek();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const getWeekRange = (offset) => {
        const now = new Date();
        
        const start = new Date(now);
        const day = start.getDay();
        
        start.setDate(start.getDate() - day + offset * 7);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        const format = (date) => date.toLocaleDateString("en-US");

        return {
            weekStart: start,
            weekEnd: end,
            start_date: format(start),
            end_date: format(end)
        };
    };

    const getCurrentWeekEnd = () => {
        const now = new Date();
        
        const start = new Date(now);
        const day = start.getDay();
        
        start.setDate(start.getDate() - day);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return end;
    };

    const getActivitiesForDay = (dayName) => {
        if(daysOfWeek.length === 0) return [];

        const dayIndex = daysOfWeek.indexOf(dayName);

        return weekActivities.filter(activity => {
            const activityDate = new Date(activity.start_date);
            return activityDate.getDay() === dayIndex;
        });
    };

    useEffect(() => {
        const initialRange = getWeekRange(currentWeekOffset);
        setWeekRange(initialRange);
        getActivitiesForWeek(initialRange);
    }, []);

    const changeWeek = (offset) => {
        const newOffset = currentWeekOffset + offset;
        const newWeekRange = getWeekRange(newOffset);

        setCurrentWeekOffset(newOffset);
        setWeekRange(newWeekRange);
        setStartOfWeek(newWeekRange.start_date);
        getActivitiesForWeek(newWeekRange);
    };

    async function getActivitiesForWeek(range) {
        if (!range) return;
        try {
            setLoading(true);

            const start = Math.floor(new Date(range.start_date).getTime() / 1000);
            const end = Math.floor(new Date(range.end_date).getTime() / 1000);

            const res = await fetch(
                `https://www.strava.com/api/v3/athlete/activities?before=${end}&after=${start}`,
                {
                    headers: {
                        'Authorization': `Bearer ${authData.access_token}`
                    }
                }
            );

            const data = await res.json();
            setWeekActivities(data);
        } catch (err) {
            console.error('Error fetching activities:', err);
        } finally {
            setLoading(false);
        }
    }

    const isSameDate = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();


    return (
        <div style={styles.container}>
            <Container fluid>
                <div style={styles.header}>
                    <div style={styles.buttonGroup}>
                        <button
                            style={{...styles.navButton, ...styles.navButtonLeft}}
                            onClick={() => changeWeek(-1)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 0 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                            </svg>
                        </button>

                        <button
                            style={{...styles.navButton, ...styles.navButtonRight}}
                            onClick={() => changeWeek(1)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            disabled={isSameDate(getCurrentWeekEnd(), new Date(weekRange.end_date))}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                            </svg>
                        </button>
                    </div>

                    <h1 style={styles.title}>
                        Activities for {weekRange.weekStart && new Date(weekRange.weekStart).toLocaleDateString()} to {weekRange.weekEnd && new Date(weekRange.weekEnd).toLocaleDateString()}
                    </h1>
                </div>
                
                <Row>
                    {daysOfWeek.map(day => (
                        <Col key={day} md={12} lg style={styles.dayColumn}>
                            <h2 style={styles.dayHeader}>{day}</h2>
                            {loading ? (
                                <p style={styles.loading}>Loading...</p>
                            ) : (weekActivities.length > 0 && getActivitiesForDay(day).length > 0 ) ?
                                getActivitiesForDay(day).map(activity => (
                                    <StravaActivityCard {...activity} />
                                ))
                            : (
                                <p style={styles.emptyState}>No activities</p>
                            )}
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

const styles = {
    container: {
        background: 'linear-gradient(to bottom right, #fff7ed, #fef2f2)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap'
    },
    buttonGroup: {
        display: 'flex',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    navButton: {
        padding: '8px 16px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    navButtonLeft: {
        borderRadius: '8px 0 0 8px',
        borderRight: 'none'
    },
    navButtonRight: {
        borderRadius: '0 8px 8px 0'
    },
    title: {
        margin: 0,
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937'
    },
    dayColumn: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    dayHeader: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '2px solid #f97316'
    },
    loading: {
        color: '#6b7280',
        fontSize: '14px',
        fontStyle: 'italic'
    },
    emptyState: {
        color: '#9ca3af',
        fontSize: '14px',
        fontStyle: 'italic',
        padding: '20px'
    }
};