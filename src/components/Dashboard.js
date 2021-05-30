import React from "react";
import { useAuth } from "../contexts/AuthContext";
// import { Button } from "react-bootstrap";
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
            {currentUser && (
                <div>
                    {currentUser && "User: " + currentUser.email}
                    <div></div>
                    <button onClick={handleLogout}>Log out</button>
                    <div style={{ padding: "2pt" }}></div>
                    <button onClick={() => history.push("/change-email")}>
                        Change Email
                    </button>
                    <div style={{ padding: "2pt" }}></div>
                    <button onClick={() => history.push("/change-password")}>
                        Change Password
                    </button>
                </div>
            )}
        </>
    );
}

export default Dashboard;
