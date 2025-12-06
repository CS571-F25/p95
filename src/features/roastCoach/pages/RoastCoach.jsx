import { Outlet } from "react-router";
import RoastCoachNavbar from '../components/RoastCoachNavbar';
import StravaAuth from '../../strava/components/StravaAuth';
import useRoastCacheCleanup from '../hooks/useRoastCacheCleanup';
import { useState } from "react";
import { useStravaAuth } from "../../strava/context/StravaLoginStatusContext";

export default function RoastCoach() {
    const [loginVisible, setLoginVisible] = useState(true);
    const { authData } = useStravaAuth();

    useRoastCacheCleanup();
    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(to bottom right, #1e2228ff, #030407ff)",
            display: "flex",
            flexDirection: "column"
        }}>
            <RoastCoachNavbar setLoginVisible={setLoginVisible} />
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                flex: 1
            }}>
                {loginVisible && !authData ? (
                    <StravaAuth setLoginVisible={setLoginVisible} />
                ) : null}
                <Outlet />
            </div>
        </div>
    );
}