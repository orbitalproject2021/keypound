import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";
import { Content } from "../components/ContentCard";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import {
  dateStringToDateObject,
  dateToDateString,
  monthsSinceDateString,
  updateBalance,
  getDocs,
  updateDocs,
  specificDateStringToDateObject,
} from "../backendUtils";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useLocation } from "react-router-dom";

function AddTransaction() {
  const state = useLocation().state;
  const date = new Date();
  const maxDate = date.toISOString().substring(0, 10);
  const [minDate, setMinDate] = useState();
  const expenseRef = useRef();
  const dateRef = useRef();
  const descriptionRef = useRef();
  const tagRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [category, setCategory] = useState("Money Out");
  const [type, setType] = useState("Need");
  const [subscribeBool, setSubscribeBool] = useState(state && state.subscribe);
  const { currentUser } = useAuth();

  useEffect(() => {
    document.title = "Add Expense - Keypound";
    if (window.innerWidth > 767) {
      descriptionRef.current.focus();
    }

    expenseRef.current.value = "0";
    getDocs(currentUser).then((doc) => {
      let monthArr = doc.data().monthArr;
      setMinDate(dateStringToDateObject(monthArr[0].date));
    });
  }, [currentUser]);

  useEffect(() => {
    if (!subscribeBool && minDate) {
      dateRef.current.value = new Date().toISOString().substr(0, 10);
    }
  }, [minDate, subscribeBool]);

  const handleSubmit = (e) => {
    setDisabled(true); // prevent re-submission during request time
    e.preventDefault();

    if (!subscribeBool) {
      // normal transaction
      const date = specificDateStringToDateObject(dateRef.current.value);

      const value =
        category === "Money Out"
          ? expenseRef.current.value * -100
          : expenseRef.current.value * 100;

      getDocs(currentUser)
        .then((doc) => {
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
            id: transactions.length,
            tag: tagRef.current.value,
          });
          monthArr[index].transactions = transactions;

          updateDocs(currentUser, { monthArr: monthArr }).then(() => {
            updateBalance(
              currentUser,
              value,
              monthsSinceDateString(dateToDateString(date))
            );
            setMessage(
              category === "Money Out"
                ? "Expense added successfully."
                : "Income added successfully."
            );
          });
        })
        .catch((error) => {
          console.log(error);
          setError((prev) => prev + "\n" + error);
        });
    } else {
      // subscription

      const value = expenseRef.current.value * -100;
      getDocs(currentUser)
        .then((doc) => {
          let monthArr = doc.data().monthArr;
          let subscriptions = monthArr[monthArr.length - 1].subscriptions;

          subscriptions.push({
            description: descriptionRef.current.value,
            value: value,
            tag: tagRef.current.value,
            id: subscriptions.length,
          });
          monthArr[monthArr.length - 1].subscriptions = subscriptions;
          monthArr[monthArr.length - 1].subscriptionAmount += value;

          updateDocs(currentUser, {
            monthArr: monthArr,
          })
            .then(() => {
              setMessage("Subscription added successfully.");
            })
            .catch((error) => {
              console.log(error);
              setError(error);
            });
        })
        .catch((error) => {
          console.log(error);
          setError((prev) => prev + "\n" + error);
        });
    }
  };

  function clearPage() {
    descriptionRef.current.value = "";
    tagRef.current.value = "";
    if (!subscribeBool) {
      dateRef.current.value = new Date().toISOString().substr(0, 10);
    }
    setDisabled(false);
    setError("");
    setMessage("");
    setType((prev) => (category === "Money In" ? "Money In" : prev));
    expenseRef.current.value = 0;
    if (window.innerWidth > 767) {
      descriptionRef.current.focus();
    }
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
        setSubscribeBool(false);
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

  const subscriptionAbstract = (
    <Form.Group id="checkbox">
      <Form.Check
        label="Subscription"
        type="checkbox"
        onChange={() => setSubscribeBool(!subscribeBool)}
        checked={subscribeBool}
      ></Form.Check>
    </Form.Group>
  );

  const expenseFill = (
    <Form.Group id="expense">
      <Form.Label>
        {category === "Money Out"
          ? subscribeBool
            ? "Monthly Fee"
            : "Expense"
          : "Income"}
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
  );

  const dateFill = () =>
    subscribeBool ? (
      <p> Subscription will be added automatically at the end of each month.</p>
    ) : (
      <Form.Group id="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          max={maxDate}
          min={minDate.toISOString().substring(0, 10)}
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

  const submitButton = (
    <Button disabled={disabled} type={"submit"} className={"custom-button"}>
      Submit
    </Button>
  );

  const resetButton = (
    <Button
      disabled={disabled}
      onClick={clearPage}
      className={"custom-button-red"}
    >
      Reset
    </Button>
  );

  const messageDescription = message && (
    <>
      <span className="add-transaction-custom-alert">{message}</span>
    </>
  );

  const errorDescription = error && (
    <>
      <span className="add-transaction-custom-alert error">{error}</span>
    </>
  );

  return (
    <>
      <Navigation active="Add Transaction" />
      <Content title="Add Transaction">
        <span className="body-title">{`Input your expenses or income here. `}</span>
        <div className="small-padding"></div>
        <Form onSubmit={handleSubmit}>
          {descriptionFill}
          {padding}
          {tagFill}
          <div
            style={{
              display: "flex",
              paddingTop: "10pt",
              paddingBottom: "10pt",
              flexWrap: "wrap",
            }}
          >
            {categoryAbstract}
            {padding}
            {category !== "Money In" && <>{typeAbstract}</>}
            {padding}
            <div
              style={{
                display: "flex",
                paddingTop: "28pt",
                paddingBottom: "12pt",
              }}
            >
              {category !== "Money In" && <>{subscriptionAbstract}</>}
            </div>
          </div>
          {expenseFill}
          {padding}
          {minDate && dateFill()}
          {padding}
          <div style={{ display: "flex" }}>
            {submitButton}
            {resetButton}
            {messageDescription}
            {errorDescription}
          </div>
        </Form>
      </Content>
    </>
  );
}

export default AddTransaction;
