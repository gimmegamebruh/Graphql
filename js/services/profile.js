async function loadProfile(token) {
  errorEl.textContent = "";

  const userData = await gqlRequest(GRAPHQL_QUERIES.currentUser, token);
  if (!userData.user || !userData.user.length) throw new Error("Could not load user.");

  const user = userData.user[0];
  const userId = user.id;

  const [xpData, myGroupsData] = await Promise.all([
    gqlRequest(GRAPHQL_QUERIES.xpTransactions, token),
    gqlRequest(GRAPHQL_QUERIES.userGroupIds(userId), token)
  ]);

  cachedTransactions = xpData.transaction || [];

  totalXpEl.textContent = formatXP(sumXP(cachedTransactions));
  renderTx(txPreviewList, cachedTransactions, 6);

  const groupIds = (myGroupsData.group_user || []).map(g => g.groupId).filter(Boolean);
  const deduplicatedAudits = await loadAudits(token, groupIds);

  populateOverview(user, userId, deduplicatedAudits.length);
  renderAuditsList(deduplicatedAudits);

  if (welcomeTextEl) welcomeTextEl.textContent = `@${user.login}`;

  const userIdTextEl = document.getElementById("userIdText");
  if (userIdTextEl) {
    if (userId !== undefined && userId !== null) {
      userIdTextEl.textContent = `User ID: ${userId}`;
    } else {
      userIdTextEl.textContent = "User ID: Not available";
    }
  }

  drawXpLineChart(xpChartEl, cachedTransactions);
  drawXpByProjectBars(xpByProjectChartEl, cachedTransactions);

  showProfile();
  showProfileHome();
}

async function loadAudits(token, groupIds) {
  if (!groupIds.length) return [];

  const auditsData = await gqlRequest(
    GRAPHQL_QUERIES.auditsByGroupIds(groupIds),
    token
  );

  return deduplicateAuditsByProject(auditsData.result || []);
}

function deduplicateAuditsByProject(audits) {
  const uniqueAudits = {};

  audits.forEach(audit => {
    const projectName = audit.object?.name || "Unknown Project";
    const existingAudit = uniqueAudits[projectName];

    if (!existingAudit || new Date(audit.createdAt) > new Date(existingAudit.createdAt)) {
      uniqueAudits[projectName] = audit;
    }
  });

  return Object.values(uniqueAudits);
}

function populateOverview(user, userId, auditsCount) {
  if (overviewUsernameEl) {
    overviewUsernameEl.textContent = user.login;
  }

  if (overviewUserIdEl) {
    overviewUserIdEl.textContent = userId ?? "Not available";
  }

  if (overviewTotalXpEl) {
    overviewTotalXpEl.textContent = formatXP(sumXP(cachedTransactions));
  }

  if (overviewAuditsCountEl) {
    overviewAuditsCountEl.textContent = auditsCount;
  }
}
