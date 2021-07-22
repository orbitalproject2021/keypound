import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import {
  dateToDateString,
  monthsSinceDateString,
  updateBalance,
  updateDocs,
  dateStringToDateObject,
  specificDateStringToDateObject,
  debug,
} from "../backendUtils";
import firebase from "firebase/app";
import Navigation from "../components/Navigation";
import { Content } from "../components/ContentCard";
import { useHistory, useLocation } from "react-router-dom";

export default function UpdateEntry() {
  const { monthArr, monthObj, id, transactionObj, date } = useLocation().state;
  const expenseRef = useRef();
  const descriptionRef = useRef();
  const tagRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [category, setCategory] = useState(
    transactionObj.type === "Money In" ? "Money In" : "Money Out"
  );
  const [type, setType] = useState(transactionObj.type);
  const dateRef = useRef();
  const { currentUser } = useAuth();
  const history = useHistory();
  const [minDate, setMinDate] = useState();

  useEffect(() => {
    document.title = "Edit entry - Keypound";
    descriptionRef.current.value = transactionObj.description;
    tagRef.current.value = transactionObj.tag;
    if (window.innerWidth > 767) {
      descriptionRef.current.focus();
    }
    expenseRef.current.value = `${Math.abs(transactionObj.value / 100)
      .toFixed(2)
      .toString()
      .replace("/B(?=(d{3})+(?!d))/g", " ")}`;
    setMinDate(dateStringToDateObject(monthArr[0].date));
  }, [transactionObj, date, monthArr]);

  useEffect(() => {
    if (minDate) {
      dateRef.current.value = date;
    }
  }, [minDate, date]);

  async function handleSubmit(e) {
    // update button
    setDisabled(true); // prevent re-submission during request time
    e.preventDefault();

    const index =
      monthArr.length -
      1 -
      monthsSinceDateString(
        dateToDateString(specificDateStringToDateObject(dateRef.current.value))
      );

    const description = descriptionRef.current.value;
    const tag = tagRef.current.value;
    const value =
      category === "Money Out"
        ? expenseRef.current.value * -100
        : expenseRef.current.value * 100;

    monthObj.transactions = monthObj.transactions.filter(
      (transaction) => transaction.id !== id
    );
    let newId = 0;
    for (const transaction of monthObj.transactions) {
      transaction.id = newId;
      newId++;
    }

    const newObj = {
      date: firebase.firestore.Timestamp.fromDate(
        specificDateStringToDateObject(dateRef.current.value)
      ),
      description,
      type,
      value,
      id: monthArr[index].transactions.length,
      tag,
    };

    let transactions = monthArr[index].transactions;
    transactions.push(newObj);

    updateDocs(currentUser, { monthArr: monthArr })
      .then(() => {
        updateBalance(
          currentUser,
          -transactionObj.value,

          monthsSinceDateString(
            dateToDateString(specificDateStringToDateObject(date))
          ),
          () =>
            updateBalance(
              currentUser,
              value,

              monthsSinceDateString(
                dateToDateString(
                  specificDateStringToDateObject(dateRef.current.value)
                )
              ),
              history.goBack
            )
        );
      })

      .catch((error) => {
        console.log(error);
        setError((prev) => prev + "\n" + error);
      });
  }

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

    try {
      await updateDocs(currentUser, {
        monthArr: monthArr,
      });
      updateBalance(
        currentUser,
        -transactionObj.value,
        monthsSinceDateString(dateToDateString(new Date(date))),
        history.goBack
      );
    } catch (e) {
      console.log(e);
      setError(e);
    }
    return monthArr;
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

  const tagFill = (
    <Form.Group id="tag">
      <Form.Label>{"Tag (Optional)"}</Form.Label>
      <Form.Control
        type="text"
        ref={tagRef}
        onChange={() => {
          setDisabled(false);
          setError("");
          setMessage("");
        }}
      />
    </Form.Group>
  );

  const dateFill = () => (
    <Form.Group id="date">
      <Form.Label>Date</Form.Label>
      <Form.Control
        type="date"
        max={new Date().toISOString().substring(0, 10)}
        min={debug(minDate).toISOString().substring(0, 10)}
        ref={dateRef}
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
      <span className="error">{error}</span>
    </>
  );

  const subscriptionText = transactionObj.type === "Subscription" && (
    <>
      <p className="error">
        This entry is a subscription. Any updates will only apply to this entry.
        To manage subscriptions, use the subscriptions page.
      </p>
    </>
  );

  return (
    <>
      <Navigation active="Breakdown" />
      <Content title="Edit Entry">
        <h4 className="body-title">Update your transaction here.</h4>
        {subscriptionText}
        <Form onSubmit={handleSubmit}>
          {descriptionFill}
          {padding}
          {tagFill}
          {type !== "Subscription" && (
            <div
              style={{
                display: "flex",
                paddingTop: "10pt",
                paddingBottom: "10pt",
              }}
            >
              {categoryAbstract}
              {padding}
              {category !== "Money In" && <>{typeAbstract}</>}
            </div>
          )}
          {padding}
          {expenseFill}
          {padding}
          {minDate && dateFill()}
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
