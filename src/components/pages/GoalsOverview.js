import React, { useEffect } from "react";
import Navigation from "../Navigation";

function GoalsOverview() {
  useEffect(() => {
    document.title = "GoalsOverview - Spendee";
  }, []);

  return <Navigation active="credit" />;
}

export default GoalsOverview;
