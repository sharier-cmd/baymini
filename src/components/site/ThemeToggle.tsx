import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "baymini-theme";

/** Inline script for <head>: applies the saved theme before first paint to avoid a flash. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`;

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // storage unavailable; theme still applies for this visit
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {isDark ? <Sun strokeWidth={1.6} /> : <Moon strokeWidth={1.6} />}
    </Button>
  );
}
