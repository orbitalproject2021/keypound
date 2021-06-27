import React, { useEffect } from "react";
import Navigation from "../components/Navigation";

function Credit() {
    useEffect(() => {
        document.title = "Credit - Spendee";
    }, []);

    return <Navigation active="credit" />;
}

export default Credit;
