import React, { useEffect } from "react";
import Navigation from "../components/Navigation";

function GoalsOverview() {
  useEffect(() => {
    document.title = "Goals Overview - Keypound";
  }, []);

  return <Navigation active="goals" />;
}

export default GoalsOverview;
