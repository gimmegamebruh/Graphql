/**
 * View management functions for showing/hiding UI sections
 */

// ==================== VIEW MANAGEMENT ====================

/**
 * Shows the login view and hides the profile view
 */
function showLogin() {
  loginView.classList.remove("hidden");
  profileView.classList.add("hidden");
}

/**
 * Shows the profile view and hides the login view
 */
function showProfile() {
  loginView.classList.add("hidden");
  profileView.classList.remove("hidden");
}

/**
 * Shows the profile home view (bento layout with stats)
 */
function showProfileHome() {
  txView?.classList.add("hidden");
  bentoView?.classList.remove("hidden");
  statsCardEl?.classList.remove("hidden");
}

/**
 * Shows the transactions view (full transaction history)
 */
function showTransactions() {
  bentoView?.classList.add("hidden");
  statsCardEl?.classList.add("hidden");
  txView?.classList.remove("hidden");
}