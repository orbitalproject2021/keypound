import React, { useEffect } from "react";
import Navigation from "../Navigation";

function Advisor() {
    useEffect(() => {
        document.title = "Advisor - Spendee";
    }, []);

    return <Navigation active="advisor" />;
}

export default Advisor;
