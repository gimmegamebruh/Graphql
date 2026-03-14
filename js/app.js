/**
 * GraphQL Profile Viewer - Main Application Entry Point
 * Initializes the application and manages global state
 */

// ==================== DOM ELEMENTS ====================

// Main view containers
const loginView = document.getElementById("loginView");
const profileView = document.getElementById("profileView");
const txView = document.getElementById("txView");

// Profile sections
const bentoView = document.querySelector(".bento");
const statsCardEl = document.getElementById("statsCard");

// Buttons
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const backToProfileBtn = document.getElementById("backToProfileBtn");
const seeMoreXpBtn = document.getElementById("seeMoreXpBtn");

// Display elements
const totalXpEl = document.getElementById("totalXp");
const errorEl = document.getElementById("error");
const auditsListEl = document.getElementById("auditsList");
const welcomeTextEl = document.getElementById("welcomeText");

// Overview elements
const overviewUsernameEl = document.getElementById("overviewUsername");
const overviewUserIdEl = document.getElementById("overviewUserId");
const overviewTotalXpEl = document.getElementById("overviewTotalXp");
const overviewAuditsCountEl = document.getElementById("overviewAuditsCount");

// Transaction lists
const txPreviewList = document.getElementById("trans-list");
const txFullList = document.getElementById("txFullList");

// Charts
const xpChartEl = document.getElementById("xpChart");
const xpByProjectChartEl = document.getElementById("xpByProjectChart");

// ==================== APPLICATION STATE ====================

let cachedTransactions = []; 

// ==================== INITIALIZATION ====================

/**
 * Application initialization - runs on page load
 */
(function init() {
  const token = getToken();
  if (!token) return showLogin();

  loadProfile(token).catch(() => {
    removeToken();
    showLogin();
  });
})();
