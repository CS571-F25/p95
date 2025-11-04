
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router";
import { useContext } from 'react';
import roastCoach from "../../assets/roastCoachLogo/favicon.svg";
import poweredByStrava from "../../assets/strava_logo.svg";
import StravaLoginStatusContext from '../../contexts/StravaLoginStatusContext';

export default function RoastCoachNavbar(props) {
    const { authData } = useContext(StravaLoginStatusContext);

    return <Navbar bg="dark" variant="dark" sticky="top" expand="sm" collapseOnSelect>
        <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Brand as={Link} to="/">
                <img
                    alt="Roast Coach Logo"
                    src={roastCoach}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                Roast Coach
            </Navbar.Brand>
            <Navbar.Collapse id="responsive-navbar-nav" className="me-auto">
                <Nav>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/about">About</Nav.Link>
                </Nav>

                <Nav className="ms-auto d-none d-md-flex">
                {authData ? (
                    <p className="me-2 mb-0" style={{color: "white"}}>
                        {authData.athlete.firstname} {authData.athlete.lastname}
                    </p>
                ) : null}
                <img
                    src={poweredByStrava}
                    alt="Powered by Strava API"
                    height="20"
                />
            </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}