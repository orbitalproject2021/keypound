# Keypound

Keypound(<https://keypound.netlify.app) is an expense tracker. This repository houses the source code for the app. The primary motivation for the app was so that we can track our expenses and transactions in a graphical manner and not over rely on excel. What we aim to do was to simplify how people track their expenditures and be able to gain control over their finances, to cultivate good personal finance habits, which isn't emphasized enough in schools.

Keypound is a self initiated project over the summer break by Ivan and Yu Qi. Initially the idea was to be done for CP2106(Orbital), but our team had been rejected unfortunately due to the module being oversubscribed. However, we still decided to pursue and created this web application on our own initiative.

## Features

- Dashboaard to get a quick overview of your month's finances, recent ransactions and balance history
- Breaksown page for more detailed and in depth view of the individual transactions 
- Ability to search sort and filter transactions under the breakdown page
- Ability to create edit and update transactions
- Ability to add recurring transactions as a monthly subscription
- Settings page to update the income to be added at the end of the month 

## Getting Started (User walkthrough process)

After signing up for an account,

1. There will be a prompt to enter the current balance, the monthly income and the earliest transaction date for the user. 
   (Take note that the date entered will be the earliest date that the user intends to add a transaction.)
2. User will then be brought to the dashboard, where he can start to add transactions and use the app.

## Tech Stack

This app was made using Create React App web framework, with Firebase by Google for data storage and authentication. The primary language is javascript. We used React Router Dom for navigation and React recharts for rendering the graphics on the dashboard. We have also used React Bootstrap 2 for styling purposes.

#
