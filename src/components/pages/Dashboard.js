import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { ContentCard, Content } from "../ContentCard";
import Navigation from "../Navigation";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import DashboardPie from "./DashboardPie";

function Dashboard() {
    const [message] = useState("");
    const [error] = useState("");
    const { currentUser } = useAuth();
    const [data, setData] = useState([]);

    function parseFirestoreData(firestoreData) {
        console.log(firestoreData.expenses[0].date.seconds);

        const firstOfMonthSeconds = Math.round(
            new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
            ).getTime() / 1000
        );
        function reducer(accumulator, current) {
            console.log(current.type);
            switch (current.type) {
                case "Need":
                    accumulator[0].value += current.value;
                    break;
                case "Want":
                    accumulator[1].value += current.value;
                    break;
                case "Unexpected":
                    accumulator[2].value += current.value;
                    break;
                default:
                    throw new Error("Invalid expense type");
            }
            return accumulator;
        }
        const data = firestoreData.expenses
            .filter((obj) => obj.date.seconds >= firstOfMonthSeconds)
            .reduce(reducer, [
                { name: "Needs", value: 0 },
                { name: "Wants", value: 0 },
                { name: "Unexpected", value: 0 },
            ]);
        console.log(data);

        return data;
    }

    useEffect(() => {
        document.title = "Dashboard - Spendee";

        // Reference to current user document from 'users' collection
        var docRef = db.collection("users").doc(currentUser.uid);

        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setData(parseFirestoreData(doc.data()));
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
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
                <Content area={[1, 3, 1, 3]} title="home">
                    <h4 className="body-title">Balance History</h4>
                    {data && <DashboardPie data={data} />}
                </Content>
            </ContentCard>
        </>
    );
}

export default Dashboard;
