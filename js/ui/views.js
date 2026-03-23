function showLogin() {
  loginView.classList.remove("hidden");
  profileView.classList.add("hidden");
}

function showProfile() {
  loginView.classList.add("hidden");
  profileView.classList.remove("hidden");
}

function showProfileHome() {
  txView?.classList.add("hidden");
  bentoView?.classList.remove("hidden");
  statsCardEl?.classList.remove("hidden");
}

function showTransactions() {
  bentoView?.classList.add("hidden");
  statsCardEl?.classList.add("hidden");
  txView?.classList.remove("hidden");
}
