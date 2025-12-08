import { Container } from "react-bootstrap";
import Section from "../../components/Section";
import ParagraphBlock from "../../components/ParagraphBlock";

export default function AboutMe() {
  return (
    <Container style={{ color: "white" }}>
      
      <Section title="About Me!">
        <ParagraphBlock
          paragraphs={[
            "Hey there! I’m Carter — creator of the Roast Coach, a little side project born from equal parts protein, chocolate milk, and questionable athletic decisions.",
            "I built this app because every activity on Strava deserves a bit of personality. Whether you crushed a marathon, took a casual stroll that somehow lasted three hours, or logged a bike ride that suspiciously looks like a drive to Taco Bell — your stats should come with a laugh.",
            "My goal? To make fitness more fun, keep you (and your friends) humble, and give your Strava feed the comedic upgrade it never asked for but definitely needed.",
            "Thanks for checking out the app — now go log some activities so I can roast you."
          ]}
        />
      </Section>

      <Section title="Disclaimer">
        <ParagraphBlock
          paragraphs={[
            "This app is an independent project created for fun. It is not endorsed by, sponsored by, or officially affiliated with Strava in any way.",
            "Roast Coach uses the publicly available Strava API in accordance with their API Terms of Service. All trademarks, activity data, and brand references belong to their respective owners.",
            "Some activity data from this app may be sent to Claude (an AI service) for processing or analysis. No personal athlete information is shared—only activity details such as workouts, distances, times, and other public activity metrics."
          ]}
        />
      </Section>

    </Container>
  );
}