import React, { useEffect } from "react";
import Navigation from "../Navigation";

function Breakdown() {
    useEffect(() => {
        document.title = "Breakdown - Spendee";
    }, []);

    return <Navigation active="breakdown" />;
}

export default Breakdown;
