import StravaActivityCard from "./StravaActivityCard";

export default function StravaActivitiesPage({activities, authData}) {
    const name = authData.athlete.firstname;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Hello {name}!</h1>

            <h2>Recent Activities ({activities.length})</h2>
            {/**Show activites as StravaActivityCards */}
            {activities.map(x => (
                <StravaActivityCard key={x.id} {...x} />
            ))}
        </div>
    );
}