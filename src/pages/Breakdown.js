import React, { useEffect } from "react";
import Navigation from "../components/Navigation";
import { TableRow } from "../components/Table";
import { ContentCard, Content } from "../components/ContentCard";
import firebase from "firebase/app";
import "firebase/firestore";

function Breakdown() {
    useEffect(() => {
        document.title = "Breakdown - Spendee";
    }, []);

    return (
        <>
            <Navigation active="breakdown" />

            <Content title="breakdown">
                <TableRow
                    expenseObj={{
                        date: firebase.firestore.Timestamp.fromDate(new Date()),
                        description: "Test",
                        type: "Money In",
                        value: 15000,
                    }}
                ></TableRow>
            </Content>
        </>
    );
}

export default Breakdown;
