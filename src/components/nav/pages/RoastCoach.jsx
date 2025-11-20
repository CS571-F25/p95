import { Outlet } from "react-router";
import { useState } from 'react';
import RoastCoachNavbar from '../RoastCoachNavbar';
import StravaAuth from '../../StravaAuth';
import StravaLoginStatusContext from '../../../contexts/StravaLoginStatusContext';

export default function RoastCoach() {
    const [authData, setAuthData] = useState(null);
    const [loginVisible, setLoginVisible] = useState(true);

    return (
        <div>
            <div>
                <StravaLoginStatusContext.Provider value={{ authData, setAuthData, setLoginVisible }}>
                    <RoastCoachNavbar />
                    <div style={{
                        width: "90%",
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        }}>
                    {loginVisible ? (
                        <StravaAuth setLoginVisible={setLoginVisible} />
                    ) : <></>}
                    <Outlet />
                    </div>
                </StravaLoginStatusContext.Provider>
            </div>
        </div>
    );
}
