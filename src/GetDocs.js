import React from "react";
import { db } from "./firebase";
import { useAuth } from "./contexts/AuthContext";

function GetDocs() {
  const { currentUser } = useAuth();
  var docRef = db.collection("users").doc(currentUser.uid);
  return docRef.get();
}

export default GetDocs;
