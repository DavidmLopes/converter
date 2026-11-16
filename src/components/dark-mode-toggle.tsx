"use client";

import { useRef, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const transitioning = useRef(false);

  const toggleDarkMode = async (event: MouseEvent<HTMLButtonElement>) => {
    if (transitioning.current) return;

    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(nextTheme);
      return;
    }

    const root = document.documentElement;
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    transitioning.current = true;
    try {
      if (typeof document.startViewTransition === "function") {
        root.style.setProperty("--theme-reveal-x", `${x}px`);
        root.style.setProperty("--theme-reveal-y", `${y}px`);
        root.style.setProperty("--theme-reveal-radius", `${radius}px`);
        root.dataset.themeTransition = "reveal";

        const transition = document.startViewTransition(() => {
          // Commit the theme before the browser captures the new page.
          flushSync(() => setTheme(nextTheme));
        });
        await transition.finished;
      } else {
        root.dataset.themeTransition = "fade";
        // Apply the transition rules before changing the theme colors.
        window.getComputedStyle(root).getPropertyValue("color");
        setTheme(nextTheme);
        await new Promise((resolve) => window.setTimeout(resolve, 500));
      }
    } catch {
      // A skipped transition must still leave the requested theme selected.
      setTheme(nextTheme);
    } finally {
      delete root.dataset.themeTransition;
      root.style.removeProperty("--theme-reveal-x");
      root.style.removeProperty("--theme-reveal-y");
      root.style.removeProperty("--theme-reveal-radius");
      transitioning.current = false;
    }
  };

  return (
    <Button
      aria-label="Toggle color theme"
      className="relative"
      variant="outline"
      size="icon"
      onClick={(event) => void toggleDarkMode(event)}
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all duration-500 motion-reduce:transition-none dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all duration-500 motion-reduce:transition-none dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
