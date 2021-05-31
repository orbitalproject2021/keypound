import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { ContentCard, Content } from "../ContentCard";
import Navigation from "../Navigation";

function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard - Spendee";
    }, []);

    const [message] = useState("");
    const [error] = useState("");

    return (
        <>
            <Navigation active="home" />
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <ContentCard>
                <Content area={[2, 1, 3, 2]} title="Content 1">
                    This is a bunch of content
                </Content>
                <Content area={[2, 2, 3, 3]} title="Content 2">
                    It's easy to do!
                </Content>
                <Content
                    area={[3, 1, 4, 2]}
                    title="Content 3"
                    bg="#d5ecc2"
                    fg="black"
                    topfg="black"
                    topbg="#a7d87e"
                >
                    Do you like colours? :D
                </Content>
                <Content
                    area={[3, 2, 4, 3]}
                    title="Content 4"
                    bg="#ffd3b4"
                    fg="black"
                    topbg="#ffa05d"
                    topfg="black"
                >
                    {"I know I do! <3"}
                </Content>
            </ContentCard>
        </>
    );
}

export default Dashboard;
