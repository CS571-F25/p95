export default function AboutMe(props) {
    return (
        <div style={{ padding: "1rem" }}>
            <h1>About Me!</h1>

            <p>
                Hey there! I’m Carter — creator of the Roast Coach, a little side project born from
                equal parts curiosity, caffeine, and questionable athletic decisions.
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
        </div>
    );
}
