"use client";

import { ThemeToggle } from "./theme-toggle";

export function LandingHeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
    </div>
  );
}
