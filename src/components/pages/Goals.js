import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { ContentCard, Content } from "../ContentCard";
import Navigation from "../Navigation";

function Goals() {
  const typeRef = useRef();
  const amountRef = useRef();
  const motivationsRef = useRef();

  useEffect(() => {
    document.title = "Goals - Spendee";
  }, []);

  return (
    <>
      <Navigation active="goals" />;
      <ContentCard>
        <Content area={[1, 3, 1, 3]} title="Add goals">
          <p>Add Goals Here</p>
          <Form>
            <Form.Group id="type">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" step="any" ref={typeRef} required />
            </Form.Group>

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

            <Form.Group id="motivations">
              <Form.Label>Motivations</Form.Label>
              <Form.Control
                type="text"
                step="any"
                ref={motivationsRef}
                required
              />
            </Form.Group>
          </Form>
        </Content>
      </ContentCard>
    </>
  );
}

export default Goals;
