import React, { useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { ContentCard, Content } from "../ContentCard";
import { Alert, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import "./Expense.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function Expense() {
    const date = new Date();
    const maxDate = date.toISOString().substring(0, 10);

    const expenseRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [type, setType] = useState("Need");
    const { currentUser } = useAuth();

    useEffect(() => {
        document.title = "Add Expense - Spendee";
        descriptionRef.current.focus();
        dateRef.current.value = new Date().toISOString().substr(0, 10);
    }, []);

    const parseMoney = (str) => {
        try {
            return parseFloat(str.replaceAll(/[^\d+.?\d*]/g, ""));
        } catch (e) {
            console.log(e);
            setError(e);
        }
    };

    const handleSubmit = (e) => {
        setDisabled(true); // prevent re-submission during request time
        e.preventDefault();
        console.log(type);

        // reference to user document
        var docRef = db.collection("users").doc(currentUser.uid);

        const [day, month, year] = dateRef.current.value.split("/");
        const date = new Date(`${year}-${month}-${day}`);

        docRef
            .update({
                expenses: firebase.firestore.FieldValue.arrayUnion({
                    description: descriptionRef.current.value,
                    date: firebase.firestore.Timestamp.fromDate(date),
                    type: type,
                    value: parseMoney(expenseRef.current.value) * 100,
                }),
            })
            .then(() => {
                setMessage("Expense added successfully.");
            });
    };

    return (
        <>
            <Navigation active="add expense" />
            <ContentCard>
                {error && <Alert>{error}</Alert>}
                <Content area={[1, 3, 1, 3]} title="add expense">
                    <p>Input your expenses here.</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                step="any"
                                ref={descriptionRef}
                                required
                                onChange={() => {
                                    setDisabled(false);
                                    setError("");
                                    setMessage("");
                                }}
                            />
                        </Form.Group>
                        <div style={{ padding: "10pt" }}></div>
                        <Form.Group id="type">
                            <Form.Label>Type</Form.Label>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={type}
                                required
                            >
                                <Dropdown.Item
                                    href="#/action-1"
                                    onClick={() => setType("Need")}
                                >
                                    Need
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="#/action-2"
                                    onClick={() => setType("Want")}
                                >
                                    Want
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="#/action-3"
                                    onClick={() => setType("Unexpected")}
                                >
                                    Unexpected
                                </Dropdown.Item>
                            </DropdownButton>
                        </Form.Group>
                        <div style={{ padding: "10pt" }}></div>
                        <Form.Group id="expense">
                            <Form.Label>Expense</Form.Label>
                            <Form.Control
                                type="number"
                                step="any"
                                ref={expenseRef}
                                min="0.01"
                                required
                                onChange={() => {
                                    setDisabled(false);
                                    setError("");
                                    setMessage("");
                                }}
                            />
                        </Form.Group>
                        <div style={{ padding: "10pt" }}></div>
                        <Form.Group id="date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                max={maxDate}
                                ref={dateRef}
                                required
                                onChange={() => {
                                    setDisabled(false);
                                    setError("");
                                    setMessage("");
                                }}
                            />
                        </Form.Group>
                        <div style={{ padding: "10pt" }}></div>

                        <Button
                            disabled={disabled}
                            type={"submit"}
                            className={"custom-button"}
                        >
                            Submit
                        </Button>
                        {message && (
                            <>
                                <span className="custom-alert">{message}</span>
                            </>
                        )}
                        {error && (
                            <>
                                <span className="custom-alert error">
                                    {error}
                                </span>
                            </>
                        )}
                    </Form>
                </Content>
            </ContentCard>
        </>
    );
}

export default Expense;
