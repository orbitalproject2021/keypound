import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { ContentCard, Content } from "../ContentCard";
import Navigation from "../Navigation";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import DashboardPie from "./DashboardPie";
import { monthlyBreakdown, getMonthlyExpenseArr } from "../../backendUtils";

function Dashboard() {
    const [message] = useState("");
    const [error] = useState("");
    const { currentUser } = useAuth();
    const [data, setData] = useState([]);

    useEffect(() => {
        document.title = "Dashboard - Spendee";

        // Reference to current user document from 'users' collection
        var docRef = db.collection("users").doc(currentUser.uid);

        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setData(monthlyBreakdown(doc.data()));
                    console.log(getMonthlyExpenseArr(doc.data()));
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    db.collection("users").doc(currentUser.uid).set({
                        expenses: [],
                    });
                    setData("none");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    }, [currentUser.uid]);

    return (
        <>
            <Navigation active="home" />
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <ContentCard>
                <Content
                    display="flex"
                    flexWrap="wrap"
                    flexDirection="column"
                    title="home"
                >
                    <h4 className="body-title">this month</h4>
                    {data && (
                        <>
                            <DashboardPie data={data.slice(0, 3)} />
                        </>
                    )}
                </Content>
            </ContentCard>
        </>
    );
}

export default Dashboard;
