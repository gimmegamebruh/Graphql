async function loginRequest(id, password) {
  const SIGNIN_URL = "https://learn.reboot01.com/api/auth/signin";
  const credentials = btoa(id + ":" + password);

  const response = await fetch(SIGNIN_URL, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + credentials
    }
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const jwt_token = JSON.parse(await response.text());
  setToken(jwt_token);
  return jwt_token;
}

function setToken(jwt_token) {
  localStorage.setItem("jwt", jwt_token);
}

function getToken() {
  return localStorage.getItem("jwt");
}

function removeToken() {
  localStorage.removeItem("jwt");
}
