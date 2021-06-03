import React, { useEffect } from "react";
import Navigation from "../Navigation";

function Goals() {
    useEffect(() => {
        document.title = "Goals - Spendee";
    }, []);

    return <Navigation active="goals" />;
}

export default Goals;
