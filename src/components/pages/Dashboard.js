import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { ContentCard, Content } from "../ContentCard";
import Navigation from "../Navigation";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardPie, DashboardBar } from "./DashboardCharts";
import { monthlyBreakdown, getMonthlyExpenseArr } from "../../backendUtils";

function Dashboard() {
    const [message] = useState("");
    const [error] = useState("");
    const { currentUser } = useAuth();
    const [piechartData, setPiechartData] = useState([]);
    const [barchartData, setBarchartData] = useState([]);

    const DUMMY = [
        {
            name: "Jan",
            value: 1,
        },
        { name: "Feb", value: 2 },
    ];

    useEffect(() => {
        document.title = "Dashboard - Spendee";

        // Reference to current user document from 'users' collection
        var docRef = db.collection("users").doc(currentUser.uid);

        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setPiechartData(monthlyBreakdown(doc.data()));
                    setBarchartData(getMonthlyExpenseArr(doc.data()));
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    db.collection("users").doc(currentUser.uid).set({
                        expenses: [],
                    });
                    setPiechartData("none");
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
                    justifyContent="center"
                >
                    <h4 className="body-title">this month</h4>
                    {barchartData && <DashboardBar data={DUMMY} />}
                    {piechartData && (
                        <>
                            <div style={styles.piechartDiv}>
                                <DashboardPie data={piechartData.slice(0, 3)} />
                            </div>
                        </>
                    )}
                </Content>
            </ContentCard>
        </>
    );
}

export default Dashboard;

const styles = {
    piechartDiv: {
        display: "flex",
        justifyContent: "center",
    },
};
