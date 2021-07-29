# Keypound

Keypound (<https://keypound.netlify.app/>) is an expense tracker. This repository houses the source code for the app. The primary motivation for the app was so that we can track our expenses and transactions in a graphical manner instead of using spreadsheets. What we aim to do is to simplify how people track their expenditure and be able to gain control over their finances, to cultivate good personal finance habits, which isn't emphasized enough in schools.

Keypound is a self-initiated project over the summer break by Ivan and Yu Qi. Initially the idea was to be done for CP2106(Orbital), but our team had been rejected unfortunately due to the module being oversubscribed. However, we still decided to pursue and created this web application on our own initiative.

## Features

![Dashboard things](https://user-images.githubusercontent.com/77185900/127454464-eb371f45-e0f0-4a70-8ae0-1b3420b022c7.png)
Use the dashboard to get a quick overview of your month's finances, recent transactions and balance history.

![Breakdown](https://user-images.githubusercontent.com/77185900/127454556-700e2a1d-1b5b-4da3-885d-1abbcef9177a.png)
Use the Breakdown page for a more detailed and in-depth view of the individual transactions, with the ability to search sort and filter transactions

![Add transactions](https://user-images.githubusercontent.com/77185900/127454610-816e853a-aedb-44be-94f7-29c2cedb04e4.png)
Create, update and delete transactions or add recurring transactions as a monthly subscription

![Update income](https://user-images.githubusercontent.com/77185900/127454711-7d757d74-6630-4e20-b59b-b364cdc61125.png)
Set an income to be added at the end of the month

## Getting Started (User walkthrough process)

After signing up for an account,

1. There will be a prompt to enter the current balance, the monthly income and the earliest transaction date for the user. 
   (Take note that the date entered will be the earliest date that the user intends to add a transaction.)
   
   ![Start](https://user-images.githubusercontent.com/77185900/127454916-9eeec27c-69f5-4f34-a1cb-77f81315713a.png)

2. User will then be brought to the dashboard, where he can start to add transactions and use the app.

## Tech Stack

This app was made using Create React App web framework, with Firebase by Google for data storage and authentication. The primary language is javascript. We used React Router Dom for navigation and React recharts for rendering the graphics on the dashboard. We have also used React Bootstrap 2 for styling purposes.
