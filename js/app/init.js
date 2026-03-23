(function init() {
  const token = getToken();

  if (!token) {
    showLogin();
    return;
  }

  loadProfile(token).catch(() => {
    removeToken();
    showLogin();
  });
})();
