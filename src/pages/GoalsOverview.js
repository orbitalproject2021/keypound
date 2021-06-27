import React, { useEffect } from "react";
import Navigation from "../components/Navigation";

function GoalsOverview() {
    useEffect(() => {
        document.title = "Goals Overview - Spendee";
    }, []);

    return <Navigation active="goals" />;
}

export default GoalsOverview;
