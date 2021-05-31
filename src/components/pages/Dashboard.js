import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { ContentCard, Content } from "../ContentCard";
import Navigation from "../Navigation";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard - Spendee";
        getData();
    }, []);

    const [message] = useState("");
    const [error] = useState("");
    const { currentUser } = useAuth();

    async function getData() {
        const snapshot = await db.collection(currentUser.uid).get();
        snapshot.forEach((doc) => {
            console.log(doc.data());
        });
    }

    return (
        <>
            <Navigation active="home" />
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <ContentCard>
                <Content area={[1, 3, 1, 3]} title="home">
                    <h4>Balance History</h4>
                </Content>
            </ContentCard>
        </>
    );
}

export default Dashboard;
