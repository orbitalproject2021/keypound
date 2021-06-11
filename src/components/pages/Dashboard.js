import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { ContentCard, Content } from "../ContentCard";
import Navigation from "../Navigation";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

function Dashboard() {
    const [message] = useState("");
    const [error] = useState("");
    const { currentUser } = useAuth();

    useEffect(() => {
        document.title = "Dashboard - Spendee";

        // Reference to current user document from 'users' collection
        var docRef = db.collection("users").doc(currentUser.uid);

        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    console.log(doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    });

    // TODO: Get needs, wants, unexpected expenses over past month and render in pie chart
    return (
        <>
            <Navigation active="home" />
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <ContentCard>
                <Content area={[1, 3, 1, 3]} title="home">
                    <h4 className="body-title">balance history</h4>
                </Content>
            </ContentCard>
        </>
    );
}

export default Dashboard;
