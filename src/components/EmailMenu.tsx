"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { Lang } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import styles from "./EmailMenu.module.css";

type Props = {
  email: string;
  lang: Lang;
  // Styles the trigger, so it can look like whatever "Email me" it replaces.
  className?: string;
  // Full-width trigger (the exit sign).
  block?: boolean;
  children: ReactNode;
};

// "Email me", with choices. A bare mailto: link does nothing on machines with no mail app set up
// (common when people use Gmail or Outlook in the browser), so this offers webmail compose links,
// the mail app, and copying the address.
export function EmailMenu({ email, lang, className, block, children }: Props) {
  const t = ui[lang].emailMenu;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const to = encodeURIComponent(email);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is shown at the bottom of the menu to copy by hand.
    }
  };

  const close = () => setOpen(false);

  return (
    <div ref={wrapRef} className={styles.wrap} data-block={block || undefined}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${className ?? ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </button>

      <div id={menuId} className={styles.menu} hidden={!open} role="group" aria-label={t.label}>
        <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${to}`} target="_blank" rel="noreferrer" onClick={close}>
          {t.gmail} <span aria-hidden="true">↗</span>
        </a>
        <a href={`https://outlook.office.com/mail/deeplink/compose?to=${to}`} target="_blank" rel="noreferrer" onClick={close}>
          {t.outlook} <span aria-hidden="true">↗</span>
        </a>
        <a href={`mailto:${email}`} onClick={close}>
          {t.app}
        </a>
        <button type="button" onClick={copy} data-copied={copied || undefined}>
          <span aria-live="polite">{copied ? t.copied : t.copy}</span>
        </button>
        <p className={styles.address}>{email}</p>
      </div>
    </div>
  );
}
