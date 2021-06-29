import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Table } from "../components/Table";
import { Content } from "../components/ContentCard";
import "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

function Breakdown() {
    const { currentUser } = useAuth();
    const [tableData, setTableData] = useState();

    useEffect(() => {
        document.title = "Breakdown - Keypound";
        const docRef = db.collection("users").doc(currentUser.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                setTableData(doc.data().monthArr);
            }
        });
    }, [currentUser.uid]);

    return (
        <>
            <Navigation active="breakdown" />

            {tableData && (
                <Content title="breakdown">
                    <h4 className="body-title">all transactions</h4>
                    <p className="content-text">
                        Select an entry to edit or delete it.
                    </p>
                    <Table monthArr={tableData} />
                </Content>
            )}
        </>
    );
}

export default Breakdown;
