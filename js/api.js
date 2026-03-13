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
    user { id login }
  }`;

  const userData = await gqlRequest(userQuery, token);
  if (!userData.user || !userData.user.length) throw new Error("Could not load user.");

  const user = userData.user[0];
  const userId = user.id;

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

  let auditsData = { audit: [] };
  if (groupIds.length > 0) {
    const auditsReceivedQuery = `
    {
      audit(
        where: {
          groupId: { _in: [${groupIds.join(",")}] }
          grade: { _is_null: false }
          auditorId: { _neq: ${userId} }
        }
        order_by: { createdAt: desc }
      ) {
        id groupId grade createdAt auditorId
        group { object { name type } }
      }
    }`;
    auditsData = await gqlRequest(auditsReceivedQuery, token);
  }

  renderAuditsList(auditsData.audit);

  if (welcomeTextEl) welcomeTextEl.textContent = `@${user.login}`;

  drawXpLineChart(xpChartEl, cachedTransactions);
  drawXpByProjectBars(xpByProjectChartEl, cachedTransactions);

  showProfile();
  showProfileHome();
}