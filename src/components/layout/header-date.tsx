"use client";

import { useEffect, useState } from "react";

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function HeaderDate() {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const raw = formatter.format(new Date());
    setValue(capitalize(raw));
  }, []);

  if (!value) {
    return (
      <span
        className="hidden max-w-[16rem] animate-pulse truncate rounded-md bg-muted px-3 py-1 text-sm md:inline-block"
        aria-hidden
      >
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    );
  }

  return (
    <span
      className="hidden max-w-[18rem] truncate text-sm capitalize text-muted-foreground md:inline"
      title={value}
      suppressHydrationWarning
    >
      {value}
    </span>
  );
}
