import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Table } from "../components/Table";
import { ContentCard, Content } from "../components/ContentCard";
import firebase from "firebase/app";
import "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

function Breakdown() {
    const { currentUser } = useAuth();
    const [tableData, setTableData] = useState();

    useEffect(() => {
        document.title = "Breakdown - Spendee";
        const docRef = db.collection("users").doc(currentUser.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                setTableData(doc.data().monthArr);
            }
        });
    }, []);

    return (
        <>
            <Navigation active="breakdown" />

            {tableData && (
                <Content title="breakdown">
                    <Table monthArr={tableData} />
                </Content>
            )}
        </>
    );
}

export default Breakdown;
