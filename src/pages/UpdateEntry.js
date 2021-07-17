import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Alert, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import {
  dateToDateString,
  monthsSinceDateString,
  updateBalance,
  updateDocs,
} from "../backendUtils";
import Navigation from "../components/Navigation";
import { Content } from "../components/ContentCard";
import { useHistory, useLocation } from "react-router-dom";

export default function UpdateEntry() {
  const { monthArr, monthObj, id, transactionObj, date } = useLocation().state;
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
    // update button
    setDisabled(true); // prevent re-submission during request time
    e.preventDefault();

    const description = descriptionRef.current.value;
    const value =
      category === "Money Out"
        ? expenseRef.current.value * -100
        : expenseRef.current.value * 100;

    monthObj.transactions[id] = {
      date: transactionObj.date,
      description,
      type,
      value,
      id,
    };

    updateDocs(currentUser, {
      monthArr: monthArr,
    })
      .then(() => {
        updateBalance(
          currentUser,
          value - transactionObj.value,
          monthsSinceDateString(dateToDateString(new Date(date)))
        );
        // history.goBack();
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  async function handleDelete() {
    setDisabled(true); // prevent re-submission during request time
    monthObj.transactions = monthObj.transactions.filter(
      (transaction) => transaction.id !== id
    );
    let newId = 0;
    for (const transaction of monthObj.transactions) {
      transaction.id = newId;
      newId++;
    }

    await updateDocs(currentUser, {
      monthArr: monthArr,
    });
    await updateBalance(
      currentUser,
      -transactionObj.value,
      monthsSinceDateString(dateToDateString(new Date(date))),
      () => history.goBack()
    );
  }

  //Abstractions for frontend
  const padding = <div style={{ padding: "10pt" }}></div>;

  const descriptionFill = (
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
  );

  const moneyOut = (
    <Dropdown.Item
      className="dropdown-item"
      onClick={() => {
        setCategory("Money Out");
        setType("Need");
      }}
    >
      Money Out
    </Dropdown.Item>
  );

  const moneyIn = (
    <Dropdown.Item
      className="dropdown-item"
      onClick={() => {
        setCategory("Money In");
        setType("Money In");
      }}
    >
      Money In
    </Dropdown.Item>
  );

  const categoryAbstract = (
    <Form.Group id="category">
      <Form.Label>Category</Form.Label>
      <DropdownButton id="dropdown-basic-button" title={category} required>
        {moneyOut}
        {moneyIn}
      </DropdownButton>
    </Form.Group>
  );

  const need = (
    <Dropdown.Item className="dropdown-item" onClick={() => setType("Need")}>
      Need
    </Dropdown.Item>
  );

  const want = (
    <Dropdown.Item className="dropdown-item" onClick={() => setType("Want")}>
      Want
    </Dropdown.Item>
  );

  const unexpected = (
    <Dropdown.Item
      className="dropdown-item"
      onClick={() => setType("Unexpected")}
    >
      Unexpected
    </Dropdown.Item>
  );

  const typeAbstract = (
    <Form.Group id="type">
      <Form.Label>Type</Form.Label>
      <DropdownButton id="dropdown-basic-button" title={type} required>
        {need}
        {want}
        {unexpected}
      </DropdownButton>
    </Form.Group>
  );

  const expenseFill = (
    <Form.Group id="expense">
      <Form.Label>{category === "Money Out" ? "Expense" : "Income"}</Form.Label>
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
  );

  const updateButton = (
    <Button
      disabled={disabled}
      type={"submit"}
      className={"custom-button-green"}
    >
      Update
    </Button>
  );

  const deleteButton = (
    <Button
      disabled={disabled}
      className={"custom-button-red"}
      onClick={handleDelete}
    >
      Delete
    </Button>
  );

  const cancelButton = (
    <Button
      disabled={disabled}
      className={"custom-button"}
      onClick={() => history.goBack()}
    >
      Cancel
    </Button>
  );

  const messageDescription = message && (
    <>
      <span className="custom-alert">{message}</span>
    </>
  );

  const errorDescription = error && (
    <>
      <span className="custom-alert error">{error}</span>
    </>
  );
  return (
    <>
      <Navigation active="Breakdown" />
      {error && <Alert>{error}</Alert>}
      <Content title="edit entry">
        <h4 className="body-title">{date}</h4>
        <Form onSubmit={handleSubmit}>
          {descriptionFill}
          <div
            style={{
              display: "flex",
              paddingTop: "10pt",
              paddingBottom: "10pt",
            }}
          >
            {categoryAbstract}
            {padding}
            {category !== "Money In" && (
              <>
                {typeAbstract}
                {padding}
              </>
            )}
          </div>
          {expenseFill}
          {padding}
          <div style={{ display: "flex" }}>
            {updateButton}
            {deleteButton}
            {cancelButton}
            {messageDescription}
            {errorDescription}
          </div>
        </Form>
      </Content>
    </>
  );
}
