import React, { useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { ContentCard, Content } from "../ContentCard";
import { Alert, Form, Button } from "react-bootstrap";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import "./Expense.css";

function Expense() {
    const date = new Date();
    const maxDate = date.toISOString().substring(0, 10);

    const expenseRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [disabled, setDisabled] = useState(false);
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
        setDisabled(true);
        e.preventDefault();
        const [day, month, year] = dateRef.current.value.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        let json;
        try {
            json = {
                description: descriptionRef.current.value,
                date: date.toISOString(),
                expense: parseMoney(expenseRef.current.value) * 100,
            };
        } catch (e) {
            setError(e);
        }

        db.collection(currentUser.uid)
            .add(json)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                setMessage("Expense added successfully.");
            })
            .catch((e) => {
                setError(`${error} \n${e}`);
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
