import React, { useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { ContentCard, Content } from "../ContentCard";
import { Alert, Form, Button } from "react-bootstrap";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { updateBalance } from "../../backendUtils";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function Settings() {
  const incomeRef = useRef();

  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    document.title = "Settings - Spendee";
    incomeRef.current.focus();
  }, []);
  const handlesubmit = (e) => {
    setDisabled(true);
    e.preventDefault();

    // reference to user document
    var docRef = db.collection("users").doc(currentUser.uid);

    docRef.get().then((doc) => {
      let monthArr = doc.data.monthArr;
      const index = monthArr.length;
      let income_var = monthArr[index].income;
      income_var = incomeRef.current.value;
      docRef
        .update({
          monthArr: monthArr,
        })
        .then(() => {
          updateBalance(currentUser, value);
          setMessage("Income updated successfully");
        });
    });
  };
  return (
    <>
      <Navigation active="settings" />;
      <ContentCard>
        <Content title="update income">
          <p>Update Income here.</p>
          <Form>
            <Form.Group id="income">
              <Form.Label>Income</Form.Label>
              <Form.Control
                type="number"
                step="any"
                ref={incomeRef}
                min="0.01"
                onChange={() => {
                  setDisabled(false);
                  setMessage("");
                }}
              ></Form.Control>
            </Form.Group>
            <div style={{ padding: "10pt" }}></div>
            <Button
              disabled={disabled}
              type={"submit"}
              className={"custom-button"}
            >
              Update
            </Button>
            {message && (
              <>
                <span className="custom-alert">{message}</span>
              </>
            )}
          </Form>
        </Content>
      </ContentCard>
    </>
  );
}

export default Settings;
