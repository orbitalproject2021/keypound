import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { Submit, authStyle, Dialog } from "./utility/AuthSheets";
import { Form, Card } from "react-bootstrap";
import { dateToDateString } from "../../backendUtils";

function Start() {
    const balanceRef = useRef();
    const incomeRef = useRef();
    const history = useHistory();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Start - Keypound";
        if (window.innerWidth > 767) {
            balanceRef.current.focus();
        }
    });

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        db.collection("users")
            .doc(currentUser.uid)
            .set({
                monthArr: [
                    {
                        balance: parseFloat(balanceRef.current.value) * 100,
                        date: dateToDateString(new Date()),
                        id: 0,
                        income: parseFloat(incomeRef.current.value) * 100,
                        isIncomeAdded: false,
                        isSubscriptionAdded: false,
                        subscriptionAmount: 0,
                        transactions: [],
                    },
                ],
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
