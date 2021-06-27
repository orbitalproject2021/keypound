import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { ContentCard, Content } from "../components/ContentCard";
import Navigation from "../components/Navigation";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { DashboardPie, DashboardBar } from "./DashboardCharts";
import {
    dashboardPieData,
    dashboardBarData,
    updateDatabase,
} from "../backendUtils";
import { useHistory } from "react-router-dom";

function Dashboard() {
    const [message] = useState("");
    const [error] = useState("");
    const { currentUser } = useAuth();
    const [piechartData, setPiechartData] = useState([]);
    const [barchartData, setBarchartData] = useState([]);
    const history = useHistory();

    useEffect(() => {
        document.title = "Dashboard - Spendee";

        // Reference to current user document from 'users' collection
        const docRef = db.collection("users").doc(currentUser.uid);
        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    updateDatabase(currentUser).then(() => {
                        docRef.get().then((doc) => {
                            if (doc.exists) {
                                setPiechartData(dashboardPieData(doc.data()));
                                setBarchartData(dashboardBarData(doc.data()));
                                console.log(dashboardPieData(doc.data()));
                            }
                        });
                    });
                } else {
                    // doc.data() will be undefined in this case
                    console.log("First Time user - proceeding to setup");
                    setPiechartData([]);
                    setBarchartData([]);
                    history.push("/start");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    }, [currentUser, history]);

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
                    {barchartData && (
                        <>
                            <h4 className="body-title">balance history</h4>
                            <div className="dashboard-bar-div desktop-only">
                                <DashboardBar
                                    data={barchartData}
                                    variant="desktop"
                                />
                            </div>
                            <div className="dashboard-bar-div mobile-only">
                                <DashboardBar
                                    data={barchartData}
                                    variant="mobile"
                                />
                            </div>
                        </>
                    )}
                    {piechartData && (
                        <>
                            <h4 className="body-title">this month</h4>
                            <div className="dashboard-pie-div desktop-only">
                                <DashboardPie data={piechartData.slice(0, 4)} />
                                <DashboardPie data={piechartData.slice(4)} />
                            </div>
                            <div className="dashboard-pie-div mobile-only">
                                <DashboardPie
                                    data={piechartData.slice(0, 4)}
                                    variant="mobile"
                                />
                                <DashboardPie
                                    data={piechartData.slice(4)}
                                    variant="mobile"
                                />
                            </div>
                        </>
                    )}
                </Content>
            </ContentCard>
        </>
    );
}

export default Dashboard;
