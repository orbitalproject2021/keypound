import React, { useEffect } from "react";
import Navigation from "../components/Navigation";

function Reminders() {
    useEffect(() => {
        document.title = "Reminders - nameless app";
    }, []);

    return <Navigation active="reminders" />;
}

export default Reminders;
