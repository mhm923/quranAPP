"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "quran-osmanya-theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    const shouldUseDark = savedTheme === "dark";

    setIsDark(shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;

    setIsDark(nextTheme);
    document.documentElement.dataset.theme = nextTheme ? "dark" : "light";
    window.localStorage.setItem(STORAGE_KEY, nextTheme ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md border border-black bg-white px-3 py-2 text-sm font-bold text-black shadow-sm transition hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
      aria-pressed={isDark}
    >
      {isDark ? "Cadaan" : "Madow"}
    </button>
  );
}
