"use client";

export default function ThemeToggle() {
  function toggleTheme() {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  return (
    <button type="button" onClick={toggleTheme} className="btn w-full">
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </button>
  );
}
