import { Container } from "react-bootstrap"

export default function Home() {
    return (
        <Container style={{textAlign: "center", color: "white"}}>
            <h1>
                Welcome to The Roast Coach
            </h1>
            <p>
                You're not logged in…which means I can't roast your athletic performance
            </p>
            <p>
                Go ahead, login. I promise to go easy on you (Probably)
            </p>
        </Container>
    );
}