function applyDarkMode() {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  document.documentElement.classList.toggle("dark", isDarkMode);
}

// Apply dark mode on page load
window.addEventListener("DOMContentLoaded", applyDarkMode);

// Check for dark mode changes on visibility change (when user switches back)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    applyDarkMode(); // Apply latest setting
  }
});
