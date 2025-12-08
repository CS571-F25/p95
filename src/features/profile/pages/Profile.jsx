import { Container, Card } from "react-bootstrap";
import UserHeatSelector from "../components/UserHeatSelector";

export default function Profile() {
  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card
        className="p-4 shadow-sm"
        style={{ maxWidth: "450px", width: "100%", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-2">User Preferences</h3>
        {/* Heat Level */}
        <UserHeatSelector />
      </Card>
    </Container>
  );
}