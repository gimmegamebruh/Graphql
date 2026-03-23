loginBtn?.addEventListener("click", async () => {
  try {
    errorEl.textContent = "";
    const id = document.getElementById("identifier").value.trim();
    const password = document.getElementById("password").value;

    const token = await loginRequest(id, password);
    await loadProfile(token);
  } catch (err) {
    errorEl.textContent = err.message || "Login failed";
  }
});

logoutBtn?.addEventListener("click", () => {
  removeToken();
  cachedTransactions = [];

  errorEl.textContent = "";
  totalXpEl.textContent = "0";

  renderAuditsList([]);
  renderTx(txPreviewList, []);
  renderTx(txFullList, []);

  if (xpChartEl) xpChartEl.innerHTML = "";
  if (xpByProjectChartEl) xpByProjectChartEl.innerHTML = "";

  showLogin();
});

seeMoreXpBtn?.addEventListener("click", () => {
  showTransactions();
  renderTx(txFullList, cachedTransactions);
});

backToProfileBtn?.addEventListener("click", () => {
  showProfileHome();
});
