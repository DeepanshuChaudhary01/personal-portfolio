import { useEffect, useState } from "react";

export type TokyoClock = { h: string; m: string; s: string };

function tokyoNow(): TokyoClock {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return { h: get("hour"), m: get("minute"), s: get("second") };
}

// Current time in Tokyo, ticking every second. Null until mounted, so server and client markup match.
export function useTokyoClock(): TokyoClock | null {
  const [clock, setClock] = useState<TokyoClock | null>(null);
  useEffect(() => {
    const tick = () => setClock(tokyoNow());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return clock;
}
