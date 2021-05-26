import React, { useContext, useState } from "react";
import Signup from "../components/Signup";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(enail, password);
  }

  const value = {
    currentUser,
  };

  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}
