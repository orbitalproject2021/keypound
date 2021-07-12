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

  //Abstractions for frontend
  const padding = <div style={{ padding: "10pt" }}></div>;

  const overviewLink = (
    <Link to="/goals-overview" className="btn btn-primary">
      Goals Overview
    </Link>
  );

  const saving = (
    <Dropdown.Item className="dropdown-item" onClick={() => setType("Saving")}>
      Saving
    </Dropdown.Item>
  );

  const investing = (
    <Dropdown.Item
      className="dropdown-item"
      onClick={() => setType("Investing")}
    >
      Investing
    </Dropdown.Item>
  );

  const spending = (
    <Dropdown.Item
      className="dropdown-item"
      onClick={() => setType("Spending")}
    >
      Spending
    </Dropdown.Item>
  );

  const typeFill = (
    <Form.Group id="type">
      <Form.Label>Type</Form.Label>
      <DropdownButton id="dropdown-basic-button" title={type} required>
        {saving}
        {investing}
        {spending}
      </DropdownButton>
    </Form.Group>
  );

  const amountFill = (
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
  );

  const motivationsFill = (
    <Form.Group id="motivations">
      <Form.Label>Motivations</Form.Label>
      <Form.Control type="text" step="any" ref={motivationsRef} required />
    </Form.Group>
  );

  const submitButton = (
    <Button type={"submit"} className={"custom-button"}>
      Submit
    </Button>
  );

  return (
    <>
      <Navigation active="goals" />
      <Content title="Add Goals">
        {overviewLink}
        <Form>
          {padding}
          <p>Add Goals Here</p>
          {typeFill}
          {padding}
          {amountFill}
          {padding}
          {motivationsFill}
          {padding}
          {submitButton}
        </Form>
      </Content>
    </>
  );
}

export default Goals;
