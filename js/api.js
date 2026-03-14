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