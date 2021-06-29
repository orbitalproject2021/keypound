import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Alert, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
    dateToDateString,
    monthsSinceDateString,
    updateBalance,
} from "../backendUtils";
import Navigation from "../components/Navigation";
import { Content } from "../components/ContentCard";
import { useHistory, useLocation } from "react-router-dom";

export default function UpdateEntry() {
    const { monthArr, monthObj, id, transactionObj, date } =
        useLocation().state;
    const expenseRef = useRef();
    const descriptionRef = useRef();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [category, setCategory] = useState(
        transactionObj.type === "Money In" ? "Money In" : "Money Out"
    );
    const [type, setType] = useState(transactionObj.type);
    const { currentUser } = useAuth();
    const history = useHistory();

    useEffect(() => {
        console.log(id);
        document.title = "Edit entry - Keypound";
        descriptionRef.current.value = transactionObj.description;
        if (window.innerWidth > 767) {
            descriptionRef.current.focus();
        }

        expenseRef.current.value = `${Math.abs(transactionObj.value / 100)
            .toFixed(2)
            .toString()
            .replace("/B(?=(d{3})+(?!d))/g", " ")}`;
    }, [transactionObj, date, id]);

    const handleSubmit = (e) => {
        setDisabled(true); // prevent re-submission during request time
        e.preventDefault();

        var docRef = db.collection("users").doc(currentUser.uid);

        const description = descriptionRef.current.value;
        const value =
            category === "Money Out"
                ? expenseRef.current.value * -100
                : expenseRef.current.value * 100;

        monthObj.transactions[id] = {
            date: firebase.firestore.Timestamp.fromDate(date),
            description,
            type,
            value,
            id,
        };

        docRef
            .update({
                monthArr: monthArr,
            })
            .then(() => {
                console.log(`old value: ${transactionObj.value}`);
                console.log(`new value: ${value}`);
                updateBalance(
                    currentUser,
                    value - transactionObj.value,
                    monthsSinceDateString(date)
                );
                history.goBack();
            })
            .catch((error) => {
                console.log(error);
                setError(error);
            });
    };

    const handleDelete = () => {
        setDisabled(true); // prevent re-submission during request time
        var docRef = db.collection("users").doc(currentUser.uid);
        monthObj.transactions = monthObj.transactions.filter(
            (transaction) => transaction.id !== id
        );
        let newId = 0;
        for (const transaction of monthObj.transactions) {
            transaction.id = newId;
            newId++;
        }

        docRef
            .update({
                monthArr: monthArr,
            })
            .then(() => {
                updateBalance(
                    currentUser,
                    -transactionObj.value,
                    monthsSinceDateString(date)
                );
                history.goBack();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Navigation active="breakdown" />
            {error && <Alert>{error}</Alert>}
            <Content title="edit entry">
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
                    <div
                        style={{
                            display: "flex",
                            paddingTop: "10pt",
                            paddingBottom: "10pt",
                        }}
                    >
                        <Form.Group id="category">
                            <Form.Label>Category</Form.Label>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={category}
                                required
                            >
                                <Dropdown.Item
                                    className="dropdownItem"
                                    onClick={() => {
                                        setCategory("Money Out");
                                        setType("Need");
                                    }}
                                >
                                    Money Out
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className="dropdownItem"
                                    onClick={() => {
                                        setCategory("Money In");
                                        setType("Money In");
                                    }}
                                >
                                    Money In
                                </Dropdown.Item>
                            </DropdownButton>
                        </Form.Group>
                        <div style={{ padding: "10pt" }}></div>
                        {category !== "Money In" && (
                            <>
                                <Form.Group id="type">
                                    <Form.Label>Type</Form.Label>
                                    <DropdownButton
                                        id="dropdown-basic-button"
                                        title={type}
                                        required
                                    >
                                        <Dropdown.Item
                                            className="dropdownItem"
                                            onClick={() => setType("Need")}
                                        >
                                            Need
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="dropdownItem"
                                            onClick={() => setType("Want")}
                                        >
                                            Want
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="dropdownItem"
                                            onClick={() =>
                                                setType("Unexpected")
                                            }
                                        >
                                            Unexpected
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </Form.Group>
                                <div style={{ padding: "10pt" }}></div>
                            </>
                        )}
                    </div>
                    <Form.Group id="expense">
                        <Form.Label>
                            {category === "Money Out" ? "Expense" : "Income"}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            step={0.01}
                            pattern="^\d*(\.\d{1,2})?$"
                            ref={expenseRef}
                            min={0.01}
                            required
                            onChange={() => {
                                setDisabled(false);
                                setError("");
                                setMessage("");
                            }}
                        />
                    </Form.Group>
                    <div style={{ padding: "10pt" }}></div>

                    <div style={{ display: "flex" }}>
                        <Button
                            disabled={disabled}
                            type={"submit"}
                            className={"custom-button-green"}
                        >
                            Update
                        </Button>
                        <Button
                            disabled={disabled}
                            className={"custom-button-red"}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                        <Button
                            disabled={disabled}
                            className={"custom-button"}
                            onClick={() => history.goBack()}
                        >
                            Cancel
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
                    </div>
                </Form>
            </Content>
        </>
    );
}
