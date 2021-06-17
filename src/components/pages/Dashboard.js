import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { ContentCard, Content } from "../ContentCard";
import Navigation from "../Navigation";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardPie, DashboardBar } from "./DashboardCharts";
import { monthlyBreakdown, dashboardBarData } from "../../backendUtils";
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
        console.log(window.innerWidth);

        // Reference to current user document from 'users' collection
        var docRef = db.collection("users").doc(currentUser.uid);

        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    console.log(doc.data());
                    setPiechartData(monthlyBreakdown(doc.data()));
                    setBarchartData(dashboardBarData(doc.data()));
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
    }, [currentUser.uid, history]);

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
                                    data={barchartData.slice(-12)}
                                    variant="desktop"
                                />
                            </div>
                            <div className="dashboard-bar-div mobile-only">
                                <DashboardBar
                                    data={barchartData.slice(-6)}
                                    variant="mobile"
                                />
                            </div>
                        </>
                    )}
                    {piechartData && (
                        <>
                            <h4 className="body-title">this month</h4>
                            <div className="dashboard-pie-div desktop-only">
                                <DashboardPie
                                    data={piechartData.slice(0, 3)}
                                    variant="desktop"
                                />
                            </div>
                            <div className="dashboard-pie-div mobile-only">
                                <DashboardPie
                                    data={piechartData.slice(0, 3)}
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
