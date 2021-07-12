import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";
import { Content } from "../components/ContentCard";
import { Alert, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  dateStringToDateObject,
  dateToDateString,
  monthsSinceDateString,
  updateBalance,
} from "../backendUtils";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function AddTransaction() {
  const date = new Date();
  const maxDate = date.toISOString().substring(0, 10);
  const [minDate, setMinDate] = useState();
  const expenseRef = useRef();
  const dateRef = useRef();
  const descriptionRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [category, setCategory] = useState("Money Out");
  const [type, setType] = useState("Need");
  const { currentUser } = useAuth();

  useEffect(() => {
    document.title = "Add Expense - Keypound";
    if (window.innerWidth > 767) {
      descriptionRef.current.focus();
    }
    dateRef.current.value = new Date().toISOString().substr(0, 10);
    expenseRef.current.value = "0";
    var docRef = db.collection("users").doc(currentUser.uid);
    docRef.get().then((doc) => {
      let monthArr = doc.data().monthArr;
      setMinDate(dateStringToDateObject(monthArr[0].date));
    });
  }, [currentUser.uid]);

  const handleSubmit = (e) => {
    setDisabled(true); // prevent re-submission during request time
    e.preventDefault();

    // reference to user document
    var docRef = db.collection("users").doc(currentUser.uid);

    const [year, month, day] = dateRef.current.value.split("-");
    const tempDate = new Date(year, month - 1, day);
    const date = new Date(
      tempDate.getTime() - new Date().getTimezoneOffset() * 60000
    );
    console.log(date);
    const value =
      category === "Money Out"
        ? expenseRef.current.value * -100
        : expenseRef.current.value * 100;

    docRef
      .get()
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
        });
        monthArr[index].transactions = transactions;
        docRef
          .update({
            monthArr: monthArr,
          })
          .then(() => {
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
          })
          .catch((error) => {
            console.log(error);
            setError(error);
          });
      })
      .catch((error) => {
        if (error instanceof TypeError) {
          console.log(error);
          setMessage(
            `Please select a date on or after 1 ${minDate.toLocaleString(
              "default",
              { month: "long" }
            )} ${minDate.getFullYear()}.`
          );
        } else {
          console.log(error);
          setError((prev) => prev + "\n" + error);
        }
      });
  };

  function clearPage() {
    descriptionRef.current.value = "";
    dateRef.current.value = new Date().toISOString().substr(0, 10);
    setDisabled(false);
    setError("");
    setMessage("");
    setType((prev) => (category === "Money In" ? "Money In" : prev));
    expenseRef.current.value = 0;
    if (window.innerWidth > 767) {
      descriptionRef.current.focus();
    }
  }

  return (
    <>
      <Navigation active="add transaction" />
      {error && <Alert>{error}</Alert>}
      <Content title="add transaction">
        <span className="body-title">{`Input your expenses or income here. `}</span>
        <div className="small-padding"></div>
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
                  className="dropdown-item"
                  onClick={() => {
                    setCategory("Money Out");
                    setType("Need");
                  }}
                >
                  Money Out
                </Dropdown.Item>
                <Dropdown.Item
                  className="dropdown-item"
                  onClick={() => {
                    setCategory("Money In");
                    setType("Money In");
                  }}
                >
                  Money In
                </Dropdown.Item>
              </DropdownButton>
            </Form.Group>
            <div className="small-padding"></div>
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
                      className="dropdown-item"
                      onClick={() => setType("Need")}
                    >
                      Need
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdown-item"
                      onClick={() => setType("Want")}
                    >
                      Want
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdown-item"
                      onClick={() => setType("Unexpected")}
                    >
                      Unexpected
                    </Dropdown.Item>
                  </DropdownButton>
                </Form.Group>
                <div className="small-padding"></div>
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
          <div className="small-padding"></div>
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
          <div className="small-padding"></div>
          <div style={{ display: "flex" }}>
            <Button
              disabled={disabled}
              type={"submit"}
              className={"custom-button"}
            >
              Submit
            </Button>
            <Button
              disabled={disabled}
              onClick={clearPage}
              className={"custom-button-red"}
            >
              Reset
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
          </div>
        </Form>
      </Content>
    </>
  );
}

export default AddTransaction;
