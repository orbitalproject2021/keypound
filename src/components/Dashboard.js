import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

import NavigationBar from "./NavigationBar";

function Dashboard() {
    const history = useHistory();
    const { currentUser, logout } = useAuth();

    async function handleLogout() {
        try {
            await logout();
            // setMessage("You have been logged out.");
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <NavigationBar active="home" />
        </>
    );
}

export default Dashboard;
