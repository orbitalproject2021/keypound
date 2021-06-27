import React, { useEffect } from "react";
import Navigation from "../components/Navigation";

function Settings() {
    useEffect(() => {
        document.title = "Settings - Spendee";
    }, []);

    return <Navigation active="settings" />;
}

export default Settings;
