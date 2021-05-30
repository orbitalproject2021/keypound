import React, { useEffect } from "react";
import Navigation from "../Navigation";

function Loans() {
    useEffect(() => {
        document.title = "Loans - Spendee";
    }, []);

    return <Navigation active="loans" />;
}

export default Loans;
