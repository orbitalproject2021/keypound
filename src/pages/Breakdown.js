import React, { useEffect } from "react";
import Navigation from "../components/Navigation";
import { TableRow, TableHeader } from "../components/Table";
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

            <Content title="breakdown" paddingLeft="0px" paddingRight="0px">
                <TableHeader />
                <TableRow
                    expenseObj={{
                        date: firebase.firestore.Timestamp.fromDate(new Date()),
                        description:
                            "The quick brown fox jumps over the lazy dog.",
                        type: "Money In",
                        value: 15000,
                    }}
                    id={0}
                ></TableRow>
            </Content>
        </>
    );
}

export default Breakdown;
