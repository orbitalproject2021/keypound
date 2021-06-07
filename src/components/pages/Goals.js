import React, { useEffect, useRef, useState } from "react";
import { Form, Dropdown, DropdownButton, Button } from "react-bootstrap";
import { ContentCard, Content } from "../ContentCard";
import Navigation from "../Navigation";
import { Link } from "react-router-dom";

function Goals() {
    const typeRef = useRef();
    const amountRef = useRef();
    const motivationsRef = useRef();
    const [type, setType] = useState("Type");

    useEffect(() => {
        document.title = "Goals - Spendee";
    }, []);

    useEffect(() => {
        amountRef.current.focus();
    });

    return (
        <>
            <Navigation active="goals" />;
            <ContentCard>
                <Content area={[1, 3, 1, 3]} title="Add goals">
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
                                ref={typeRef}
                                required
                            >
                                <Dropdown.Item
                                    href="#/action-1"
                                    onClick={() => setType("Saving")}
                                >
                                    Saving
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="#/action-2"
                                    onClick={() => setType("Investing")}
                                >
                                    Investing
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="#/action-3"
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
            </ContentCard>
        </>
    );
}

export default Goals;
