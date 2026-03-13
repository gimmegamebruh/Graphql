# GraphQL Profile Viewer

## 🎯 Project Objective

The objective of this project is to learn the GraphQL query language by creating a personal profile page that displays school information and statistics. This application demonstrates practical GraphQL usage by querying real data from the Reboot01 platform's GraphQL endpoint.

## ✨ Features Implemented

### 🔐 Authentication
- JWT-based login system
- Secure token management with localStorage
- Automatic session handling

### 👤 Profile Information Display
- **Basic user identification** (username/login)
- **XP amount** with formatted display (B, kB, MB)
- **Audit results** with PASS/FAIL status and grades
- **Transaction history** with detailed XP breakdowns

### 📊 Statistics & Data Visualization
**Mandatory SVG-based graphs:**
- **XP Progression Over Time** - Line chart showing XP growth timeline
- **XP Earned by Project** - Horizontal bar chart ranking projects by XP contribution

### 🎨 UI/UX Design
- Modern, responsive design with dark theme
- Clean card-based layout
- Smooth transitions and hover effects
- Mobile-friendly interface
- Intuitive navigation between views

## 🛠 Technical Implementation

### GraphQL Integration
- **Endpoint**: `https://learn.reboot01.com/api/graphql-engine/v1/graphql`
- **Queries**: User data, XP transactions, audit results, group information
- **Authentication**: Bearer token authorization

### Data Visualizations (SVG)
- **XP Over Time Chart**: Cumulative XP progression with date axis
- **Project XP Chart**: Horizontal bars showing XP distribution across projects
- **Interactive Elements**: Hover states and responsive design
- **Data Processing**: Real-time calculation of statistics and aggregations

### Code Architecture
- **Modular JavaScript**: Separated concerns across multiple files
- **DOM Management**: Efficient element selection and manipulation
- **Error Handling**: Comprehensive error states and user feedback
- **Performance**: Optimized rendering and data caching

## 📁 Project Structure

```
├── index.html          # Main HTML page with semantic structure
├── css/
│   └── style.css       # Modern CSS with custom properties and animations
├── js/
│   ├── app.js          # Main entry point with DOM constants and initialization
│   ├── auth.js         # Authentication functions (login/logout/token management)
│   ├── graphql.js      # GraphQL API client with error handling
│   ├── utils.js        # Utility functions (XP formatting, date handling, HTML escaping)
│   ├── views.js        # View management functions (show/hide UI sections)
│   ├── renderers.js    # List and chart rendering functions with SVG generation
│   ├── api.js          # Data loading functions with GraphQL query orchestration
│   └── events.js       # Event handlers for user interactions
└── README.md           # This documentation
```

## 🚀 Usage

1. Open `index.html` in a modern web browser
2. Enter your Reboot01 username/email and password
3. Authenticate to access your personal data
4. Explore your profile information, XP history, and audit results
5. View interactive statistics graphs showing your learning journey

## 🏗 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: GraphQL with custom queries
- **Authentication**: JWT tokens
- **Data Visualization**: Pure SVG (no external libraries)
- **Styling**: Modern CSS with CSS custom properties
- **Architecture**: Modular JavaScript with separation of concerns

## 📈 GraphQL Queries Used

The application performs several GraphQL queries:
- User identification and basic info
- XP transactions filtered by module and type
- Audit results with grades and group information
- Group membership for audit access

## 🎯 Learning Outcomes

This project demonstrates:
- GraphQL query construction and execution
- JWT authentication flow
- SVG-based data visualization
- Modern JavaScript modular architecture
- Responsive web design principles
- API integration and error handling