import React, { useEffect } from "react";
import Navigation from "../components/Navigation";

function Credit() {
    useEffect(() => {
        document.title = "Credit - Keypound";
    }, []);

    return <Navigation active="credit" />;
}

export default Credit;
