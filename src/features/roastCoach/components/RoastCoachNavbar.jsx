import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { useContext, useEffect, useState } from 'react';
import roastCoach from "../../../assets/roastCoachLogo/favicon-96x96.png";
import poweredByStrava from "../../../assets/strava_logo.svg";
import StravaLoginStatusContext from '../../strava/context/StravaLoginStatusContext';

export default function RoastCoachNavbar({setLoginVisible}) {
    const { authData, logout, roastName, generatingRoast } = useContext(StravaLoginStatusContext);
    const navigation = useNavigate();
    const [userName, setUserName] = useState("");

    // Sets the visible user name on the nav bar
    useEffect(() => {
        if (!authData) return;

        // Name is either a generated roast name from StravaLoginStatusContext or 
        // the users strava first and last name
        const tempName = (roastName && !generatingRoast)
            ? roastName
            : `${authData.athlete.firstname} ${authData.athlete.lastname}`;

            setUserName(tempName);
    }, [authData, roastName, generatingRoast]);

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

                {/* Strava Logo - Desktop only */}
                <img
                    src={poweredByStrava}
                    alt="Powered by Strava API"
                    height="20"
                    className="opacity-75 d-none d-sm-block ms-auto me-2"
                />

                {/* Toggle for mobile */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                {/* Collapsible Nav */}
                <Navbar.Collapse id="responsive-navbar-nav" className="px-2 px-sm-0">
                    <Nav className="me-auto mt-2 mt-sm-0">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">
                            Home
                        </Nav.Link>
                        {authData ? (
                            <Nav.Link as={Link} to="/week-review" className="nav-link-custom">
                                Week in Roasts
                            </Nav.Link>
                        ) : null}
                        <Nav.Link as={Link} to="/about" className="nav-link-custom">
                            About
                        </Nav.Link>
                    </Nav>

                    {/* Right side */}
                    <Nav className="align-items-sm-center mt-2 mt-sm-0">
                        {userName ? (
                            <NavDropdown
                                align="end"
                                title={
                                    <span className="d-inline-flex align-items-center">
                                        {userName}
                                    </span>
                                }
                                className="mb-2 mb-sm-0"
                            >
                                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => {
                                    logout();
                                    setUserName(null);
                                    navigation("/");
                                }}>Sign Out</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Button
                                variant="outline-light"
                                className="mb-2 mb-sm-0"
                                onClick={() => setLoginVisible(true)}
                            >
                                Login
                            </Button>
                        )}

                        {/* Strava Logo - Mobile only */}
                        <div className="d-sm-none text-center mt-3 mb-2">
                            <img
                                src={poweredByStrava}
                                alt="Powered by Strava API"
                                height="16"
                                className="opacity-75"
                            />
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}