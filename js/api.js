/**
 * API functions for loading data from GraphQL backend
 */

// ==================== DATA LOADING ====================

/**
 * Loads user profile data from GraphQL API
 * @param {string} token - JWT authentication token
 */
async function loadProfile(token) {
  errorEl.textContent = "";

  const userQuery = `
  {
    user { id login attrs }
  }`;

  const userData = await gqlRequest(userQuery, token);
  console.log('User data response:', userData);
  if (!userData.user || !userData.user.length) throw new Error("Could not load user.");

  const user = userData.user[0];
  const userId = user.id;

  console.log('User object:', user);
  console.log('User ID:', userId);
  console.log('User login:', user.login);

  const xpQuery = `
  {
    transaction(
      where: {
        type: { _eq: "xp" }
        path: { _like: "/bahrain/bh-module/%" }
        object: { type: { _in: ["project", "piscine"] } }
      }
      order_by: { createdAt: desc }
    ) {
      path
      amount
      createdAt
      object { name type }
    }
  }`;

  const myGroupsQuery = `
  {
    group_user(where: { userId: { _eq: ${userId} } }) {
      groupId
    }
  }`;

  const [xpData, myGroupsData] = await Promise.all([
    gqlRequest(xpQuery, token),
    gqlRequest(myGroupsQuery, token)
  ]);

  cachedTransactions = xpData.transaction || [];

  totalXpEl.textContent = formatXP(sumXP(cachedTransactions));
  renderTx(txPreviewList, cachedTransactions, 6);

  const groupIds = (myGroupsData.group_user || []).map(g => g.groupId).filter(Boolean);

  let auditsData = { result: [] };
  if (groupIds.length > 0) {
    const auditsReceivedQuery = `
    {
      result(
        where: {
          grade: { _gte: 1 }
          object: { type: { _eq: "project" } }
          groupId: { _in: [${groupIds.join(",")}] }
          auditorId: { _neq: ${userId} }
        }
        order_by: { createdAt: desc }
      ) {
        grade
        path
        createdAt
        object {
          id
          name
          type
        }
      }
    }`;
    auditsData = await gqlRequest(auditsReceivedQuery, token);
  }

  // Deduplicate audits by project name, keeping the most recent one
  const uniqueAudits = {};
  auditsData.result.forEach(audit => {
    const projectName = audit.object?.name || 'Unknown Project';
    if (!uniqueAudits[projectName] || new Date(audit.createdAt) > new Date(uniqueAudits[projectName].createdAt)) {
      uniqueAudits[projectName] = audit;
    }
  });
  const deduplicatedAudits = Object.values(uniqueAudits);

  renderAuditsList(deduplicatedAudits);

  console.log('User data:', user);
  console.log('User ID:', userId);

  if (welcomeTextEl) welcomeTextEl.textContent = `@${user.login}`;
  const userIdTextEl = document.getElementById("userIdText");
  if (userIdTextEl) {
    if (userId !== undefined && userId !== null) {
      userIdTextEl.textContent = `User ID: ${userId}`;
      console.log('Set user ID text to:', `User ID: ${userId}`);
    } else {
      userIdTextEl.textContent = 'User ID: Not available';
      console.log('User ID not available');
    }
  } else {
    console.log('userIdTextEl not found');
  }

  drawXpLineChart(xpChartEl, cachedTransactions);
  drawXpByProjectBars(xpByProjectChartEl, cachedTransactions);

  showProfile();
  showProfileHome();
}