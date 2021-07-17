import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";
import { Content } from "../components/ContentCard";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "firebase/auth";
import "firebase/firestore";
import { getDocs, updateDocs } from "../backendUtils";

function Settings() {
  const incomeRef = useRef();

  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const [oldIncome, setOldIncome] = useState();

  useEffect(() => {
    document.title = "Settings - Keypound";
    if (window.innerWidth > 767) {
      incomeRef.current.focus();
    }
    getDocs(currentUser).then((doc) => {
      const monthArr = doc.data().monthArr;
      setOldIncome((monthArr[monthArr.length - 1].income / 100).toFixed(2));
    });
  }, [currentUser]);

  const handlesubmit = (e) => {
    setDisabled(true);
    e.preventDefault();

    getDocs(currentUser).then((doc) => {
      const monthArr = doc.data().monthArr;
      const index = monthArr.length - 1;
      const newIncome = incomeRef.current.value * 100;
      monthArr[index].income = newIncome;
      updateDocs(currentUser, {
        monthArr: monthArr,
      }).then(() => {
        setMessage("Income updated successfully");
      });
    });
  };

  //Abstractions for frontend
  const padding = <div style={{ padding: "10pt" }}></div>;

  const incomeFill = (
    <Form.Group id="income">
      <Form.Label>Update Income:</Form.Label>
      <Form.Control
        type="number"
        step={0.01}
        pattern="^\d*(\.\d{1,2})?$" // allow only 2 d.p
        ref={incomeRef}
        onChange={() => {
          setDisabled(false);
          setMessage("");
        }}
        placeholder={oldIncome}
      ></Form.Control>
    </Form.Group>
  );

  const submitButton = (
    <Button disabled={disabled} type={"submit"} className={"custom-button"}>
      Update
    </Button>
  );

  const messageDescription = message && (
    <>
      <span className="add-transaction-custom-alert">{message}</span>
    </>
  );
  return (
    <>
      <Navigation active="Settings" />
      <Content title="Settings">
        <Form onSubmit={handlesubmit}>
          {incomeFill}
          <p className="content-text" style={{ paddingTop: "1em" }}>
            This income will apply from this month onwards.
          </p>
          {padding}
          {submitButton}
          {messageDescription}
        </Form>
      </Content>
    </>
  );
}

export default Settings;
