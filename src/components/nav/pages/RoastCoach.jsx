import { Outlet } from "react-router";
import { useState } from 'react';
import RoastCoachNavbar from '../RoastCoachNavbar';
import StravaAuth from '../../StravaAuth';
import StravaLoginStatusContext from '../../../contexts/StravaLoginStatusContext';

export default function RoastCoach() {
    const [authData, setAuthData] = useState(null);

    return (
        <div>
            <div>
                <StravaLoginStatusContext.Provider value={{ authData, setAuthData }}>
                    <RoastCoachNavbar />
                    {authData ? (
                        <Outlet />
                    ) : (
                        <StravaAuth setAuthData={setAuthData} />
                    )}
                </StravaLoginStatusContext.Provider>
            </div>
        </div>
    );
}
