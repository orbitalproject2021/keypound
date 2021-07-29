import React from "react";
import Content from "../components/ContentCard";
import Navigation from "../components/Navigation";

export default function About() {
  return (
    <>
      <Navigation />
      <Content title="About Us">
        <p className="body-title">About Keypound</p>
        <div>
          <p
            classname="content-text"
            align="justify"
            style={{ fontSize: "1.3em", fontWeight: 100 }}
          >
            Keypound is a self-initiated project by Ivan and Yu Qi. The aim of
            the app is to simplify the way people think about managing their
            personal finances. No more complicated spreadsheets and formulas,
            just a few simple clicks and you can see the overview of your
            finances. We hope that the app can help to cultivate good personal
            finance habits, which is something that isn't emphasized enough in
            schools.
          </p>
        </div>
      </Content>
    </>
  );
}
