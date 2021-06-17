import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { Submit, authStyle, Dialog } from "./utility/AuthSheets";
import { Form, Card } from "react-bootstrap";

function Start() {
    const balanceRef = useRef();
    const incomeRef = useRef();
    const history = useHistory();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Start - Spendee";
        balanceRef.current.focus();
    });

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        db.collection("users")
            .doc(currentUser.uid)
            .set({
                expenses: [],
                balance: parseFloat(balanceRef.current.value) * 100,
                income: parseFloat(incomeRef.current.value) * 100,
            })
            .then(() => {
                history.push("/");
            });
    }

    return (
        <Dialog>
            <Card>
                <Card.Body>
                    <h2 className={authStyle.title}>Enter your details</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="balance">
                            <Form.Label>Bank Balance</Form.Label>
                            <Form.Control
                                type="number"
                                step="any"
                                ref={balanceRef}
                                min="0.01"
                                required
                            />
                        </Form.Group>
                        <Form.Group id="income">
                            <Form.Label>Monthly Income</Form.Label>
                            <Form.Control
                                type="number"
                                step="any"
                                ref={incomeRef}
                                required
                            />
                        </Form.Group>
                        <Submit loading={loading}>Submit</Submit>
                    </Form>
                </Card.Body>
            </Card>
        </Dialog>
    );
}

export default Start;
