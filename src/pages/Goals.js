import React, { useEffect, useRef, useState } from "react";
import { Form, Dropdown, DropdownButton, Button } from "react-bootstrap";
import { Content } from "../components/ContentCard";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";

function Goals() {
    const amountRef = useRef();
    const motivationsRef = useRef();
    const [type, setType] = useState("Type");

    useEffect(() => {
        document.title = "Goals - Keypound";
        if (window.innerWidth > 767) {
            amountRef.current.focus();
        }
    }, []);

    return (
        <>
            <Navigation active="goals" />

            <Content title="add goals">
                <Link to="/goals-overview" className="btn btn-primary">
                    Goals Overview
                </Link>
                <Form>
                    <div style={{ padding: "5pt" }}></div>
                    <p>Add Goals Here</p>
                    <Form.Group id="type">
                        <Form.Label>Type</Form.Label>
                        <DropdownButton
                            id="dropdown-basic-button"
                            title={type}
                            required
                        >
                            <Dropdown.Item
                                className="dropdownItem"
                                onClick={() => setType("Saving")}
                            >
                                Saving
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="dropdownItem"
                                onClick={() => setType("Investing")}
                            >
                                Investing
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="dropdownItem"
                                onClick={() => setType("Spending")}
                            >
                                Spending
                            </Dropdown.Item>
                        </DropdownButton>
                    </Form.Group>

                    <div style={{ padding: "10pt" }}></div>

                    <Form.Group id="amount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            step="any"
                            ref={amountRef}
                            min="0.01"
                            required
                        />
                    </Form.Group>

                    <div style={{ padding: "10pt" }}></div>

                    <Form.Group id="motivations">
                        <Form.Label>Motivations</Form.Label>
                        <Form.Control
                            type="text"
                            step="any"
                            ref={motivationsRef}
                            required
                        />
                    </Form.Group>

                    <div style={{ padding: "10pt" }}></div>

                    <Button type={"submit"} className={"custom-button"}>
                        Submit
                    </Button>
                </Form>
            </Content>
        </>
    );
}

export default Goals;
