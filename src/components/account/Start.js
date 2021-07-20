import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { Submit, authStyle, Dialog } from "./utility/AuthSheets";
import { Form, Card } from "react-bootstrap";
import { dateToDateString, updateDatabase } from "../../backendUtils";

function Start() {
  const balanceRef = useRef();
  const incomeRef = useRef();
  const dateRef = useRef();
  const history = useHistory();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Start - Keypound";
    if (window.innerWidth > 767) {
      balanceRef.current.focus();
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    db.collection("users")
      .doc(currentUser.uid)
      .set({
        monthArr: [
          {
            balance: parseFloat(balanceRef.current.value) * 100,
            date: dateToDateString(new Date(dateRef.current.value)),
            id: 0,
            income: parseFloat(incomeRef.current.value) * 100,
            isIncomeAdded: false,
            isSubscriptionAdded: false,
            subscriptionAmount: 0,
            transactions: [],
            subscriptions: [],
          },
        ],
      })
      .then(() => {
        updateDatabase(currentUser, false).then(() => history.push("/"));
      });
  }

  //Abstractions for frontend

  const padding = <div style={{ padding: "10pt" }}></div>;

  const balanceFill = (
    <Form.Group id="balance">
      <Form.Label>Current Balance</Form.Label>
      <Form.Control
        type="number"
        step="any"
        ref={balanceRef}
        min="0.01"
        required
      />
    </Form.Group>
  );

  const incomeFill = (
    <Form.Group id="income">
      <Form.Label>Monthly Income</Form.Label>
      <Form.Control type="number" step="any" ref={incomeRef} required />
    </Form.Group>
  );

  const dateFill = (
    <Form.Group id="date">
      <Form.Label>Earliest Transaction Date</Form.Label>
      <Form.Control
        type="date"
        max={new Date().toISOString().substring(0, 10)} // current date
        ref={dateRef}
        required
      />
    </Form.Group>
  );

  const submitButton = <Submit loading={loading}>Submit</Submit>;

  return (
    <Dialog>
      <Card>
        <Card.Body>
          <h2 className={authStyle.title}>Enter your details</h2>
          <Form onSubmit={handleSubmit}>
            {balanceFill}
            {padding}
            {incomeFill}
            {padding}
            {dateFill}

            <p>
              Note: This is the earliest date that Keypound will allow you to
              enter.
            </p>
            {padding}
            {submitButton}
          </Form>
        </Card.Body>
      </Card>
    </Dialog>
  );
}

export default Start;
