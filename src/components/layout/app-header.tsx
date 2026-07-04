"use client";

import { MOCK_ESTABLISHMENT } from "@/config/establishment-demo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import { HeaderDate } from "./header-date";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  currentModuleLabel: string;
  currentModuleDescription?: string;
  onMenuClick: () => void;
};

export function AppHeader({
  currentModuleLabel,
  currentModuleDescription,
  onMenuClick,
}: Props) {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-auto min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3 md:h-14 md:flex-nowrap md:px-6 md:py-0">
        <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center">
          <button
            type="button"
            className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card md:mt-0 md:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <Menu className="h-[1.125rem] w-[1.125rem]" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-foreground md:text-base">
              {MOCK_ESTABLISHMENT.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground md:text-sm">
              <span className="font-medium text-foreground/90">
                {currentModuleLabel}
              </span>
              {currentModuleDescription ? (
                <span className="text-muted-foreground">
                  {" "}
                  · {currentModuleDescription}
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:justify-normal md:gap-4">
          <HeaderDate />
          <Separator
            orientation="vertical"
            className="hidden h-6 md:block md:self-center"
          />
          <ThemeToggle />
          <Avatar className="h-9 w-9 ring-2 ring-border md:h-10 md:w-10">
            <AvatarFallback className="bg-primary text-[0.7rem] font-semibold uppercase text-primary-foreground md:text-xs">
              {MOCK_ESTABLISHMENT.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
