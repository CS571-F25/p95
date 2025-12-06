import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { useContext, useEffect, useState } from 'react';
import roastCoach from "../../../assets/roastCoachLogo/favicon-96x96.png";
import poweredByStrava from "../../../assets/strava_logo.svg";
import StravaLoginStatusContext from '../../strava/context/StravaLoginStatusContext';

export default function RoastCoachNavbar({setLoginVisible}) {
    const { authData, setAuthData, roastName, generatingRoast } = useContext(StravaLoginStatusContext);
    const navigation = useNavigate();
    const [userName, setUserName] = useState("Athlete");

    useEffect(() => {
        const tempName = (roastName && !generatingRoast) ? roastName : `${authData.athlete.firstname} ${authData.athlete.lastname}`;
        setUserName(tempName);
    }, [authData])

    return (
        <Navbar bg="dark" variant="dark" sticky="top" expand="sm" collapseOnSelect>
            <Container>
                {/* Brand */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <img
                        alt="Roast Coach Logo"
                        src={roastCoach}
                        width="30"
                        height="30"
                        className="d-inline-block"
                    />
                    <span className="fw-semibold">Roast Coach</span>
                </Navbar.Brand>

                {/* Toggle for mobile */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                {/* Collapsible Nav */}
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">
                            Home
                        </Nav.Link>
                            {authData ? <Nav.Link as={Link} to="/week-review" className="nav-link-custom">
                            Week in Roasts
                        </Nav.Link> : <></>}
                        <Nav.Link as={Link} to="/about" className="nav-link-custom">
                            About
                        </Nav.Link>
                    </Nav>

                    {/* Right side */}
                    <Nav className="align-items-center">
                        {userName ? (
                            <NavDropdown
                                align="end"
                                title={
                                    <span className="d-inline-flex align-items-center">
                                        {userName}
                                    </span>
                                }
                                className="me-3"
                            >
                                <NavDropdown.Item as={Link} to="/profile" >Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => {
                                    setAuthData(null),
                                    navigation("/")
                                }}>Sign Out</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Button
                                variant="outline-light"
                                className="me-3"
                                onClick={() => setLoginVisible(true)}
                            >
                                Login
                            </Button>
                        )}

                        {/* Strava Logo */}
                        <img
                            src={poweredByStrava}
                            alt="Powered by Strava API"
                            height="20"
                            className="opacity-75"
                        />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}