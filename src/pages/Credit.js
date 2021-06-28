import React, { useEffect } from "react";
import Navigation from "../components/Navigation";

function Credit() {
    useEffect(() => {
        document.title = "Credit - nameless app";
    }, []);

    return <Navigation active="credit" />;
}

export default Credit;
