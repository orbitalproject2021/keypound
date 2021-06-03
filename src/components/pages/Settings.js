import React, { useEffect } from "react";
import Navigation from "../Navigation";

function Settings() {
    useEffect(() => {
        document.title = "Settings - Spendee";
    }, []);

    return <Navigation active="settings" />;
}

export default Settings;
