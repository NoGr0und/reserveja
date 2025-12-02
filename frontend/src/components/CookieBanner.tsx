"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(CONSENT_KEY) : null;
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = (value: "all" | "necessary") => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CONSENT_KEY, value);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-30 w-[min(1100px,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-blue-500/30 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 shadow-lg shadow-blue-500/10 backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="md:max-w-[70%]">
          Usamos cookies para melhorar sua experiência. Aceita cookies necessários e analíticos?
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            type="button"
            onClick={() => accept("all")}
          >
            Aceitar todos
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            type="button"
            onClick={() => accept("necessary")}
          >
            Somente necessários
          </Button>
        </div>
      </div>
    </div>
  );
}
