# GraphQL Profile Viewer

A web application that displays user profile information from a GraphQL API, including XP (experience points), audits, and transaction history.

## Features

- User authentication via JWT tokens
- Display of user XP and transaction history
- Audit results visualization
- Interactive charts showing XP progression over time
- XP breakdown by project

## Project Structure

```
├── index.html          # Main HTML page
├── css/
│   └── style.css       # Application styles
├── js/
│   ├── app.js          # Main application entry point with DOM constants and initialization
│   ├── auth.js         # Authentication functions (login/logout/token management)
│   ├── graphql.js      # GraphQL API client
│   ├── utils.js        # Utility functions (formatting, date handling, HTML escaping)
│   ├── views.js        # View management functions (show/hide UI sections)
│   ├── renderers.js    # List and chart rendering functions
│   ├── api.js          # Data loading functions (GraphQL queries)
│   └── events.js       # Event handlers for user interactions
└── README.md           # This file
```

## Usage

1. Open `index.html` in a web browser
2. Enter your username/email and password
3. View your profile information, XP, audits, and transaction history

## API

This application connects to the Reboot01 GraphQL API at `https://learn.reboot01.com/api/graphql-engine/v1/graphql`.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- GraphQL