"use client";

import { useState } from "react";
import styles from "./Contact.module.css";

type Props = { email: string; label: string; copied: string };

export function CopyEmail({ email, label, copied: copiedText }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // No clipboard access (old browser or blocked): open the mail app instead.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button type="button" className={styles.secondary} onClick={copy} data-copied={copied || undefined}>
      <span aria-live="polite">
        {copied ? (
          <>
            <span className="jp" lang="ja">コピーしました</span>
            {copiedText && ` ${copiedText}`}
          </>
        ) : (
          label
        )}
      </span>
    </button>
  );
}
