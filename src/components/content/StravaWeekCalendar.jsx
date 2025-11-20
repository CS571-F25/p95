import { useState, useEffect, useContext } from 'react';
import { Col, Row, Container, Card, Button } from 'react-bootstrap';
import StravaLoginStatusContext from '../../contexts/StravaLoginStatusContext';
import { formatTime, formatDistance } from '../../utils'

export default function StravaWeekCalendar() {
    const { authData } = useContext(StravaLoginStatusContext);
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [weekRange, setWeekRange] = useState({start_date: null, end_date: null});
    const [weekActivities, setWeekActivities] = useState([]);

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const getWeekRange = (offset) => {
        const now = new Date();
        
        // Create a date at the start of the requested week
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

    const getActivitiesForDay = (dayName) => {
        if(daysOfWeek.length === 0) return;

        const dayIndex = daysOfWeek.indexOf(dayName);

        return weekActivities.filter(activity => {
            const activityDate = new Date(activity.start_date);
            return activityDate.getDay() === dayIndex;
        });
    };

    // Update useEffect to initialize week range and fetch
    useEffect(() => {
        const initialRange = getWeekRange(currentWeekOffset);
        setWeekRange(initialRange);
        getActivitiesForWeek(initialRange);
    }, []);

    // Updated changeWeek
    const changeWeek = (offset) => {
        const newOffset = currentWeekOffset + offset;
        const newWeekRange = getWeekRange(newOffset);

        setCurrentWeekOffset(newOffset);
        setWeekRange(newWeekRange);
        getActivitiesForWeek(newWeekRange);
    };

    // Updated getActivitiesForWeek
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

    return (
        <Container key={1} fluid>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex" }}>
                    <Button
                        variant="outline-secondary"
                        style={{
                            padding: "4px 8px",
                            borderRadius: "8px 0 0 8px",
                            borderRight: "none"
                        }}
                        onClick={() => changeWeek(-1)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 0 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                    </Button>

                    <Button
                        variant="outline-secondary"
                        style={{
                            padding: "4px 8px",
                            borderRadius: "0 8px 8px 0"
                        }}
                        onClick={() => changeWeek(1)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                        </svg>
                    </Button>
                </div>

                <h1 style={{ margin: 0 }}>
                    Activities for {new Date(weekRange.weekStart).toLocaleDateString()} to {new Date(weekRange.weekEnd).toLocaleDateString()}
                </h1>
            </div>
            <Row>
                {daysOfWeek.map(day => (
                    <Col key={day} md={12} lg style={{textAlign: "center"}}>
                        <h2>{day}</h2>
                        {loading ? <p>Loading...</p> :
                            getActivitiesForDay(day).map(activity => (
                                <Card key={activity.name} style={{ margin: "10px", padding: "5px" }}>
                                    <Card.Title>{activity.name}</Card.Title>
                                    <Card.Body>
                                        {activity.distance ? <p><strong>Distance:</strong> {formatDistance(activity.distance)}</p> : <></>}
                                        <p><strong>Time:</strong> {formatTime(activity.moving_time)}</p>
                                    </Card.Body>
                                </Card>
                            ))
                        }
                    </Col>
                ))}
            </Row>
        </Container>
    );
}