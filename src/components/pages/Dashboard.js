import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import Navigation from "../Navigation";

function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard - Spendee";
    }, []);

    const [message] = useState("");
    const [error] = useState("");

    return (
        <>
            <Navigation active="home" />
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
        </>
    );
}

export default Dashboard;
