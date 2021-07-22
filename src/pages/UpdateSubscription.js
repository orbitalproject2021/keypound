import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, Button } from "react-bootstrap";
import { updateDocs, getDocs } from "../backendUtils";
import Navigation from "../components/Navigation";
import { Content } from "../components/ContentCard";
import { useHistory, useLocation } from "react-router-dom";

export function UpdateSubscription() {
  const { id } = useLocation().state;
  const expenseRef = useRef();
  const descriptionRef = useRef();
  const tagRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const { currentUser } = useAuth();
  const history = useHistory();
  const [monthArr, setMonthArr] = useState();
  const [monthObj, setMonthObj] = useState();
  const [subscriptionObj, setSubscriptionObj] = useState();

  useEffect(() => {
    document.title = "Edit subscription - Keypound";
    getDocs(currentUser).then((doc) => {
      const arr = doc.data().monthArr;
      const month = arr[arr.length - 1];
      const sub = month.subscriptions[id];
      setMonthArr(arr);
      setMonthObj(month);
      setSubscriptionObj(sub);
    });
  }, [currentUser, id]);

  useEffect(() => {
    descriptionRef.current.value = subscriptionObj
      ? subscriptionObj.description
      : "";
    tagRef.current.value = subscriptionObj ? subscriptionObj.tag : "";
    if (window.innerWidth > 767) {
      descriptionRef.current.focus();
    }
    expenseRef.current.value = subscriptionObj
      ? `${Math.abs(subscriptionObj.value / 100).toFixed(2)}`
      : 0;
  }, [subscriptionObj]);

  async function handleSubmit(e) {
    // update button
    setDisabled(true); // prevent re-submission during request time
    e.preventDefault();
    const description = descriptionRef.current.value;
    const tag = tagRef.current.value;
    const value = expenseRef.current.value * -100;
    const newObj = {
      description,
      tag,
      value,
      id,
    };
    monthObj.subscriptions[id] = newObj;
    updateDocs(currentUser, { monthArr: monthArr }).then(() =>
      history.goBack()
    );
  }

  async function handleDelete() {
    setDisabled(true); // prevent re-submission during request time
    monthObj.subscriptions = monthObj.subscriptions.filter(
      (subscription) => subscription.id !== id
    );
    let newId = 0;
    for (const subscription of monthObj.transactions) {
      subscription.id = newId;
      newId++;
    }
    updateDocs(currentUser, { monthArr: monthArr }).then(() =>
      history.goBack()
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

  const expenseFill = (
    <Form.Group id="expense">
      <Form.Label>Monthly Fee</Form.Label>
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
      Cancel subscription
    </Button>
  );

  const cancelButton = (
    <Button
      disabled={disabled}
      className={"custom-button"}
      onClick={() => history.goBack()}
    >
      Back
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

  return (
    <>
      <Navigation active="Subscriptions" />
      <Content title="Edit Entry">
        <h4 className="body-title">Update your subscription here.</h4>
        <Form onSubmit={handleSubmit}>
          {descriptionFill}
          {padding}
          {tagFill}
          {padding}
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
