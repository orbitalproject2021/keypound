import React, { useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { ContentCard, Content } from "../ContentCard";
import { Alert, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import {
  dateToDateString,
  monthsSinceDateString,
  updateBalance,
} from "../../backendUtils";
import "./Expense.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function Expense() {
  const date = new Date();
  const maxDate = date.toISOString().substring(0, 10);

  const expenseRef = useRef();
  const dateRef = useRef();
  const descriptionRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [category, setCategory] = useState("Money In");
  const [type, setType] = useState("Need");
  const { currentUser } = useAuth();

  useEffect(() => {
    document.title = "Add Expense - Spendee";
    descriptionRef.current.focus();
    dateRef.current.value = new Date().toISOString().substr(0, 10);
    expenseRef.current.value = "0";
  }, []);

  const handleSubmit = (e) => {
    setDisabled(true); // prevent re-submission during request time
    e.preventDefault();

    // reference to user document
    var docRef = db.collection("users").doc(currentUser.uid);

    const [day, month, year] = dateRef.current.value.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const value = expenseRef.current.value * -100; // TODO: conditional statement to handle money in

    docRef.get().then((doc) => {
      const index =
        doc.data().monthArr.length -
        1 -
        monthsSinceDateString(dateToDateString(date));
      let monthArr = doc.data().monthArr;
      let transactions = monthArr[index].transactions;
      transactions.push({
        description: descriptionRef.current.value,
        date: firebase.firestore.Timestamp.fromDate(date),
        type: type,
        value: value,
      });
      monthArr[index].transactions = transactions;
      docRef
        .update({
          monthArr: monthArr,
        })
        .then(() => {
          updateBalance(currentUser, value);
          setMessage("Expense added successfully."); // TODO: Ensure message correctness for both money in and money out
        });
    });
  };

  function clearPage() {
    descriptionRef.current.value = "";
    dateRef.current.value = new Date().toISOString().substr(0, 10);
    setType("Need");
    setDisabled(false);
    setError("");
    setMessage("");
    expenseRef.current.value = 0;
    descriptionRef.current.focus();
  }

  return (
    <>
      <Navigation active="add expense" />
      <ContentCard>
        {error && <Alert>{error}</Alert>}
        <Content title={category === "Money In" ? "Add Income" : "Add Expense"}>
          <p>
            Input your expenses here.{" "}
            <span className="dark-link" onClick={clearPage}>
              Clear
            </span>
          </p>
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
            <Form.Group id="category">
              <Form.Label>Category</Form.Label>
              <DropdownButton
                id="dropdown-basic-button"
                title={category}
                required
              >
                <Dropdown.Item
                  className="dropdownItem"
                  href="#/action-1"
                  onClick={() => {
                    setCategory("Money In");
                    setRestricted(false);
                    setType("Money In");
                  }}
                >
                  Money In
                </Dropdown.Item>
                <Dropdown.Item
                  className="dropdownItem"
                  href="#/action-2"
                  onClick={() => {
                    setCategory("Money Out");
                    setType("Need");
                    setRestricted(true);
                  }}
                >
                  Money Out
                </Dropdown.Item>
              </DropdownButton>
            </Form.Group>
            <div style={{ padding: "10pt" }}></div>
            {restricted && (
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
                      href="#/action-1"
                      onClick={() => setType("Need")}
                    >
                      Need
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdownItem"
                      href="#/action-2"
                      onClick={() => setType("Want")}
                    >
                      Want
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdownItem"
                      href="#/action-3"
                      onClick={() => setType("Unexpected")}
                    >
                      Unexpected
                    </Dropdown.Item>
                  </DropdownButton>
                </Form.Group>
                <div style={{ padding: "10pt" }}></div>
              </>
            )}
            <Form.Group id="expense">
              <Form.Label>
                {category === "Money In" ? "Income" : "Expense"}
              </Form.Label>
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
                <span className="custom-alert error">{error}</span>
              </>
            )}
          </Form>
        </Content>
      </ContentCard>
    </>
  );
}

export default Expense;
