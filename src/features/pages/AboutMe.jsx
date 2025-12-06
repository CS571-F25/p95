import { Container } from "react-bootstrap";

export default function AboutMe() {
    return (
        <Container style={{color: "white"}}>
            <h1>About Me!</h1>

            <p>
                Hey there! I’m Carter — creator of the Roast Coach, a little side project born from
                equal parts protein, chocolate milk, and questionable athletic decisions.
            </p>

            <p>
                I built this app because every activity on Strava deserves a bit of personality.
                Whether you crushed a marathon, took a casual stroll that somehow lasted three hours,
                or logged a bike ride that suspiciously looks like a drive to Taco Bell — your stats
                should come with a laugh.
            </p>

            <p>
                My goal? To make fitness more fun, keep you (and your friends) humble, and give your
                Strava feed the comedic upgrade it never asked for but definitely needed.
            </p>

            <p>
                Thanks for checking out the app — now go log some activities so I can roast you.
            </p>

            <hr style={{ margin: "2rem 0" }} />

            <h2>Disclaimer</h2>
            <p>
                This app is an independent project created for fun. It is <strong>not</strong> endorsed 
                by, sponsored by, or officially affiliated with Strava in any way.
            </p>

            <p>
                Roast Coach uses the publicly available Strava API in accordance with their API Terms
                of Service. All trademarks, activity data, and brand references belong to their
                respective owners.
            </p>

            <p>
                Some activity data from this app may be sent to Claude (an AI service) for processing or analysis.
                <strong>No personal athlete information</strong> is shared—only activity details such as workouts,
                distances, times, and other public activity metrics.
            </p>

        </Container>
    );
}
