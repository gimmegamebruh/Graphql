const GRAPHQL_QUERIES = {
  currentUser: `
    query GetCurrentUser {
      user {
        id
        login
      }
    }
  `,

  xpTransactions: `
    query GetXpTransactions {
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
        object {
          name
          type
        }
      }
    }
  `,

  userGroupIds(userId) {
    return `
      query GetUserGroupIds {
        group_user(where: { userId: { _eq: ${Number(userId)} } }) {
          groupId
        }
      }
    `;
  },

  auditsByGroupIds(groupIds) {
    const safeGroupIds = (groupIds || [])
      .map(Number)
      .filter(Number.isFinite);

    return `
      query GetAuditsByGroupIds {
        result(
          where: {
            grade: { _gte: 1 }
            object: { type: { _eq: "project" } }
            groupId: { _in: [${safeGroupIds.join(",")}] }
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
      }
    `;
  }
};
