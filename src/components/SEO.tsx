import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "product" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const upsertMeta = (selector: string, attr: string, name: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const SEO = ({ title, description, canonical, image, type = "website", jsonLd }: SEOProps) => {
  useEffect(() => {
    document.title = title.length > 60 ? title.slice(0, 57) + "…" : title;
    const desc = (description || "").slice(0, 160);
    const url = canonical || (typeof window !== "undefined" ? window.location.href.split("?")[0] : "");
    const img = image || "https://storage.googleapis.com/gpt-engineer-file-uploads/umYhliniEuWlcR1Z2maXflzO0R63/social-images/social-1776072269773-the_Women-removebg-preview.webp";

    if (desc) upsertMeta('meta[name="description"]', "name", "description", desc);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    if (desc) upsertMeta('meta[property="og:description"]', "property", "og:description", desc);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:image"]', "property", "og:image", img);
    if (url) upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    if (desc) upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", desc);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", img);

    if (url) upsertLink("canonical", url);

    // JSON-LD
    const existing = document.head.querySelector('script[data-seo-jsonld="true"]');
    if (existing) existing.remove();
    if (jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-seo-jsonld", "true");
      s.text = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [title, description, canonical, image, type, JSON.stringify(jsonLd)]);

  return null;
};

export default SEO;
