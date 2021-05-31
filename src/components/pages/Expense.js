import React, { useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { ContentCard, Content } from "../ContentCard";
import { Alert, Form, Button } from "react-bootstrap";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

function Expense() {
    useEffect(() => {
        document.title = "Add Expense - Spendee";
    }, []);

    const expenseRef = useRef();
    const dateRef = useRef();
    const [error, setError] = useState("");
    const { currentUser } = useAuth();

    const parseMoney = (str) => {
        try {
            return parseFloat(str.replaceAll(/[^\d+.?\d*]/g, ""));
        } catch (e) {
            console.log(e);
            setError(e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const [day, month, year] = dateRef.current.value.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        const json = {
            date: date.toISOString(),
            expense: parseMoney(expenseRef.current.value) * 100,
        };
        db.collection(currentUser.uid)
            .add(json)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    return (
        <>
            <Navigation active="expense" />
            <ContentCard>
                {error && <Alert>{error}</Alert>}
                <Content area={[1, 3, 1, 3]} title="Expenses">
                    <p>Input your expenses here.</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="expense">
                            <Form.Label>Expense</Form.Label>
                            <Form.Control
                                type="number"
                                step="any"
                                ref={expenseRef}
                                min="0.01"
                            />
                        </Form.Group>
                        <div style={{ padding: "10pt" }}></div>
                        <Form.Group id="date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" ref={dateRef} />
                        </Form.Group>
                        <div style={{ padding: "10pt" }}></div>
                        <Button type={"submit"} className={"custom-button"}>
                            Submit
                        </Button>
                    </Form>
                </Content>
            </ContentCard>
        </>
    );
}

export default Expense;
