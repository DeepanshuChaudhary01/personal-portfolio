"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist/legacy/build/pdf.mjs";
import styles from "./PdfViewer.module.css";

type PageLink = { href: string; left: number; top: number; width: number; height: number };
type Status = "loading" | "ready" | "error";

type Props = {
  src: string;
  downloadName: string;
  pages: number;
  aspect: number;
};

// Draws the PDF with pdf.js so it looks the same in every browser, phones included.
// Links in the PDF stay clickable, and the page text is available to screen readers.
export function PdfViewer({ src, downloadName, pages, aspect }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [width, setWidth] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [links, setLinks] = useState<PageLink[][]>([]);
  const [text, setText] = useState<string[]>([]);

  // Load pdf.js (only on this page) and the document.
  useEffect(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        loadingTask = pdfjs.getDocument({ url: src });
        const loaded = await loadingTask.promise;
        if (!cancelled) setDoc(loaded);
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      loadingTask?.destroy();
    };
  }, [src]);

  // Re-render at the new width when the layout changes, debounced.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    let timer = 0;
    const observer = new ResizeObserver(([entry]) => {
      window.clearTimeout(timer);
      const next = Math.floor(entry.contentRect.width);
      timer = window.setTimeout(() => setWidth(next), 120);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!doc || width === 0) return;
    let cancelled = false;
    const tasks: RenderTask[] = [];

    (async () => {
      try {
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        const pageLinks: PageLink[][] = [];
        const pageText: string[] = [];

        for (let n = 1; n <= Math.min(doc.numPages, pages); n++) {
          const page = await doc.getPage(n);
          const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
          const canvas = canvasRefs.current[n - 1];
          if (!canvas || cancelled) return;

          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          const task = page.render({
            canvas,
            viewport,
            transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0],
          });
          tasks.push(task);
          await task.promise;

          // Link positions as percentages of the page, so they scale with it.
          const annotations = await page.getAnnotations();
          pageLinks.push(
            annotations
              .filter((a) => a.subtype === "Link" && typeof a.url === "string")
              .map((a) => {
                const [x1, y1] = viewport.convertToViewportPoint(a.rect[0], a.rect[1]);
                const [x2, y2] = viewport.convertToViewportPoint(a.rect[2], a.rect[3]);
                return {
                  href: a.url as string,
                  left: (Math.min(x1, x2) / viewport.width) * 100,
                  top: (Math.min(y1, y2) / viewport.height) * 100,
                  width: (Math.abs(x2 - x1) / viewport.width) * 100,
                  height: (Math.abs(y2 - y1) / viewport.height) * 100,
                };
              }),
          );

          const content = await page.getTextContent();
          pageText.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
        }

        if (!cancelled) {
          setLinks(pageLinks);
          setText(pageText);
          setStatus("ready");
        }
      } catch (err) {
        const wasCancelled = err instanceof Error && err.name === "RenderingCancelledException";
        if (!cancelled && !wasCancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      tasks.forEach((t) => t.cancel());
    };
  }, [doc, width, pages]);

  if (status === "error") {
    return (
      <div className={styles.fallback}>
        <p className={styles.fallbackTitle}>This browser couldn&apos;t draw the resume here.</p>
        <p>
          <a href={src} target="_blank" rel="noreferrer">
            Open the PDF
          </a>{" "}
          or{" "}
          <a href={src} download={downloadName}>
            download it
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div ref={frameRef} className={styles.frame} aria-busy={status === "loading"}>
      {Array.from({ length: pages }, (_, i) => (
        <div
          key={i}
          className={styles.sheet}
          style={{ aspectRatio: `1 / ${aspect}` } as CSSProperties}
          data-ready={status === "ready" || undefined}
        >
          <canvas
            ref={(el) => {
              canvasRefs.current[i] = el;
            }}
            className={styles.canvas}
            aria-hidden="true"
          />
          {links[i]?.map((link) => (
            <a
              key={`${link.href}-${link.top}`}
              href={link.href}
              className={styles.link}
              style={{ left: `${link.left}%`, top: `${link.top}%`, width: `${link.width}%`, height: `${link.height}%` }}
              {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <span className="sr-only">{link.href}</span>
            </a>
          ))}
          {text[i] && <div className="sr-only">{text[i]}</div>}
          {status === "loading" && (
            <div className={styles.loading} role="status">
              <span className="jp" lang="ja">まもなく到着</span>
              <span>Arriving shortly</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
