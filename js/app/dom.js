const loginView = document.getElementById("loginView");
const profileView = document.getElementById("profileView");
const txView = document.getElementById("txView");

const bentoView = document.querySelector(".bento");
const statsCardEl = document.getElementById("statsCard");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const backToProfileBtn = document.getElementById("backToProfileBtn");
const seeMoreXpBtn = document.getElementById("seeMoreXpBtn");

const totalXpEl = document.getElementById("totalXp");
const errorEl = document.getElementById("error");
const auditsListEl = document.getElementById("auditsList");
const welcomeTextEl = document.getElementById("welcomeText");

const overviewUsernameEl = document.getElementById("overviewUsername");
const overviewUserIdEl = document.getElementById("overviewUserId");
const overviewTotalXpEl = document.getElementById("overviewTotalXp");
const overviewAuditsCountEl = document.getElementById("overviewAuditsCount");

const txPreviewList = document.getElementById("trans-list");
const txFullList = document.getElementById("txFullList");

const xpChartEl = document.getElementById("xpChart");
const xpByProjectChartEl = document.getElementById("xpByProjectChart");

let cachedTransactions = [];
