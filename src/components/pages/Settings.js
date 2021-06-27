import React, { useEffect, useRef, useState } from "react";
import Navigation from "../Navigation";
import { ContentCard, Content } from "../ContentCard";
import { Alert, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function Settings() {
  const incomeRef = useRef();

  useEffect(() => {
    document.title = "Settings - Spendee";
  }, []);

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
              ></Form.Control>
            </Form.Group>
          </Form>
        </Content>
      </ContentCard>
    </>
  );
}

export default Settings;
