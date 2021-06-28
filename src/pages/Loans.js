import React, { useEffect } from "react";
import Navigation from "../components/Navigation";

function Loans() {
    useEffect(() => {
        document.title = "Loans - nameless app";
    }, []);

    return <Navigation active="loans" />;
}

export default Loans;
