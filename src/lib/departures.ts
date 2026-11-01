// Fetches the feeds in content/feeds.ts and turns them into rows for the Departures board.
// Server-only. Each feed is cached for DEPARTURES.refreshSeconds; a feed that fails or times out is
// skipped, so one broken blog never breaks the board or the build.

import { XMLParser } from "fast-xml-parser";
import { DEPARTURES, FEEDS, TOPIC_RULES, type FeedSource, type TopicId } from "@/content/feeds";

export type Departure = {
  title: string;
  url: string;
  source: string;
  date: Date;
  topic: TopicId;
};

type RawItem = { title: string; url: string; date: Date; categories: string[]; text: string; summary: string };

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", htmlEntities: true });

// Feed fields arrive as strings, numbers, { "#text": … } objects or arrays of those.
function str(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return str(value[0]);
  if (typeof value === "object") {
    const node = value as Record<string, unknown>;
    return str(node["#text"] ?? node["@_term"] ?? node["@_href"]);
  }
  return "";
}

const list = (value: unknown): unknown[] => (value == null ? [] : Array.isArray(value) ? value : [value]);
const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function atomLink(links: unknown): string {
  const all = list(links) as Record<string, unknown>[];
  const alternate = all.find((l) => !l["@_rel"] || l["@_rel"] === "alternate") ?? all[0];
  return typeof alternate === "string" ? alternate : str(alternate?.["@_href"]);
}

function parseFeed(xml: string): RawItem[] {
  const doc = parser.parse(xml) as Record<string, Record<string, unknown>>;
  const rss = doc.rss?.channel as Record<string, unknown> | undefined;
  const nodes = (rss ? list(rss.item) : list(doc.feed?.entry)) as Record<string, unknown>[];

  return nodes.map((node) => {
    const title = plain(str(node.title));
    const categories = list(node.category).map(str).filter(Boolean);
    return {
      title,
      url: rss ? str(node.link) || str(node.guid) : atomLink(node.link),
      date: new Date(str(node.pubDate) || str(node.published) || str(node.updated) || str(node["dc:date"])),
      categories,
      text: `${title} ${categories.join(" ")}`,
      summary: plain(str(node.description) || str(node.summary) || str(node.content)).slice(0, 400),
    };
  });
}

function classify(item: RawItem, source: FeedSource): TopicId | null {
  for (const [topic, rule] of TOPIC_RULES) if (rule.test(item.text)) return topic;
  if (source.topic) return source.topic;
  for (const [topic, rule] of TOPIC_RULES) if (rule.test(item.summary)) return topic;
  return null;
}

async function readFeed(source: FeedSource): Promise<Departure[]> {
  const res = await fetch(source.url, {
    next: { revalidate: DEPARTURES.refreshSeconds },
    signal: AbortSignal.timeout(10_000),
    headers: { "User-Agent": "DC Line portfolio feed reader" },
  });
  if (!res.ok) throw new Error(`${res.status}`);

  return parseFeed(await res.text())
    .filter((item) => item.title && item.url.startsWith("http") && !Number.isNaN(item.date.getTime()))
    .filter((item) => !source.onlyCategories || item.categories.some((c) => source.onlyCategories!.includes(c)))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 15)
    .flatMap((item) => {
      const topic = classify(item, source);
      return topic ? [{ title: item.title, url: item.url, source: source.name, date: item.date, topic }] : [];
    });
}

const urlKey = (url: string) => url.replace(/[?#].*$/, "").replace(/\/$/, "").toLowerCase();
const titleKey = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "");

export async function getDepartures(): Promise<{ rows: Departure[]; sources: number; updated: Date }> {
  const results = await Promise.allSettled(FEEDS.map(readFeed));
  const ok = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));

  const seen = new Set<string>();
  const perSource = new Map<string, number>();
  const rows: Departure[] = [];

  // Newest first; drop the same article reached twice (same link or same title), cap each source.
  for (const item of ok.flat().sort((a, b) => b.date.getTime() - a.date.getTime())) {
    const keys = [urlKey(item.url), titleKey(item.title)];
    if (keys.some((k) => seen.has(k))) continue;
    if ((perSource.get(item.source) ?? 0) >= DEPARTURES.perSource) continue;
    keys.forEach((k) => seen.add(k));
    perSource.set(item.source, (perSource.get(item.source) ?? 0) + 1);
    rows.push(item);
    if (rows.length === DEPARTURES.rows) break;
  }

  return { rows, sources: ok.length, updated: new Date() };
}
