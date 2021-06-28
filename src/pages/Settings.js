import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";
import { Content } from "../components/ContentCard";
import { Form, Button } from "react-bootstrap";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import "firebase/auth";
import "firebase/firestore";

function Settings() {
    const incomeRef = useRef();

    const [disabled, setDisabled] = useState(false);
    const [message, setMessage] = useState("");
    const { currentUser } = useAuth();
    const [oldIncome, setOldIncome] = useState();
    var docRef = db.collection("users").doc(currentUser.uid);

    useEffect(() => {
        document.title = "Settings - nameless app";
        incomeRef.current.focus();
        docRef.get().then((doc) => {
            const monthArr = doc.data().monthArr;
            setOldIncome(
                (monthArr[monthArr.length - 1].income / 100).toFixed(2)
            );
            console.log(monthArr[monthArr.length - 1].income);
        });
    }, [docRef]);

    const handlesubmit = (e) => {
        setDisabled(true);
        e.preventDefault();

        docRef.get().then((doc) => {
            const monthArr = doc.data().monthArr;
            const index = monthArr.length - 1;
            const newIncome = incomeRef.current.value * 100;
            monthArr[index].income = newIncome;
            docRef
                .update({
                    monthArr: monthArr,
                })
                .then(() => {
                    setMessage("Income updated successfully");
                });
        });
    };
    return (
        <>
            <Navigation active="settings" />
            <Content title="settings">
                <Form onSubmit={handlesubmit}>
                    <Form.Group id="income">
                        <Form.Label>Update income:</Form.Label>
                        <Form.Control
                            type="number"
                            step={0.01}
                            pattern="^\d*(\.\d{1,2})?$" // allow only 2 d.p
                            ref={incomeRef}
                            onChange={() => {
                                setDisabled(false);
                                setMessage("");
                            }}
                            placeholder={oldIncome}
                        ></Form.Control>
                    </Form.Group>
                    <div style={{ padding: "10pt" }}></div>
                    <Button
                        disabled={disabled}
                        type={"submit"}
                        className={"custom-button"}
                    >
                        Update
                    </Button>
                    {message && (
                        <>
                            <span className="custom-alert">{message}</span>
                        </>
                    )}
                </Form>
            </Content>
        </>
    );
}

export default Settings;
