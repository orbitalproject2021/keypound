import React, { useEffect } from "react";
import Navigation from "../components/Navigation";

function Reminders() {
    useEffect(() => {
        document.title = "Reminders - Spendee";
    }, []);

    return <Navigation active="reminders" />;
}

export default Reminders;
