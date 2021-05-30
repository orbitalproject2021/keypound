import React, { useEffect } from "react";
import Navigation from "../Navigation";

function Expense() {
    useEffect(() => {
        document.title = "Expense - Spendee";
    }, []);

    return <Navigation active="expense" />;
}

export default Expense;
