// DC05 · Departures: engineering blogs I follow, filtered to four topics.
// Articles are matched to a topic by keywords in the title and categories (then the summary).
// Sources with a `topic` fall back to it when nothing matches; the others are dropped unless they match.

export type TopicId = "ai" | "backend" | "distributed" | "rails";

export const TOPICS: Record<TopicId, { letter: string; label: string; labelJa: string; color: string }> = {
  ai: { letter: "A", label: "AI / LLM", labelJa: "AI・LLM", color: "var(--line-ai)" },
  backend: { letter: "B", label: "Backend", labelJa: "バックエンド", color: "var(--line-backend)" },
  distributed: { letter: "D", label: "Distributed", labelJa: "分散システム", color: "var(--line-data)" },
  rails: { letter: "R", label: "Rails", labelJa: "Rails", color: "var(--line-cloud)" },
};

// Checked in this order; the first match wins.
export const TOPIC_RULES: [TopicId, RegExp][] = [
  ["rails", /\b(rails|ruby|hotwire|turbo|active ?record|solid ?(queue|cache|cable)|kamal|rubygems?)\b/i],
  [
    "ai",
    /\b(ai|llms?|gpt[-\w]*|agents?|agentic|machine learning|ml|inference|embeddings?|transformers?|rag|prompt(s|ing)?|fine-?tun\w*|neural|diffusion|chatgpt|claude|gemini|copilot|language models?)\b/i,
  ],
  [
    "distributed",
    /\b(distributed|consensus|replicat\w*|scal(e|es|ing|ability)|clusters?|shard\w*|kubernetes|k8s|availability|outages?|incidents?|edge|latency|throughput|fault[- ]toleran\w*|multi-region|failover|load balanc\w*|queues?|streaming|kafka|event-driven)\b/i,
  ],
  [
    "backend",
    /\b(apis?|databases?|postgres\w*|mysql|sql|cach\w*|backend|servers?|microservices?|performance|golang|rust|java|python|graphql|grpc|storage|indexing|search|migrations?|infrastructure|reliability|observability|deploy\w*)\b/i,
  ],
];

export type FeedSource = {
  name: string;
  url: string;
  topic?: TopicId;
  // Only keep posts filed under one of these categories (for feeds that mix in company news).
  onlyCategories?: string[];
};

export const FEEDS: FeedSource[] = [
  { name: "Simon Willison", url: "https://simonwillison.net/atom/everything/", topic: "ai" },
  { name: "Hugging Face", url: "https://huggingface.co/blog/feed.xml", topic: "ai" },
  { name: "Google Research", url: "https://research.google/blog/rss/", topic: "ai" },
  // OpenAI's feed also carries company, policy and startup news; keep the technical categories.
  {
    name: "OpenAI",
    url: "https://openai.com/news/rss.xml",
    topic: "ai",
    onlyCategories: ["Engineering", "Research", "Product", "Publication"],
  },
  { name: "Netflix", url: "https://netflixtechblog.com/feed" },
  { name: "Cloudflare", url: "https://blog.cloudflare.com/rss/" },
  { name: "GitHub", url: "https://github.blog/engineering/feed/" },
  { name: "AWS Architecture", url: "https://aws.amazon.com/blogs/architecture/feed/" },
  { name: "Stripe", url: "https://stripe.com/blog/feed.rss" },
  { name: "Martin Fowler", url: "https://martinfowler.com/feed.atom" },
  { name: "Rails", url: "https://rubyonrails.org/feed.xml", topic: "rails" },
  { name: "Shopify", url: "https://shopify.engineering/blog.atom" },
];

export const DEPARTURES = {
  // How often the board refreshes (seconds). Also the home page's revalidation interval.
  refreshSeconds: 6 * 60 * 60,
  rows: 12,
  // Keeps one busy blog from filling the board.
  perSource: 2,
};
