const GRAPHQL_URL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

async function gqlRequest(query, jwt_token) {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + jwt_token
    },
    body: JSON.stringify({ query })
  });

  if (!res.ok) {
    throw new Error("GraphQL request failed with status " + res.status);
  }

  const json = await res.json();

  if (json.errors && json.errors.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}
