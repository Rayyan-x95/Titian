import { useEffect } from 'react';
import { getPublicUrlBase } from '@/core/publicUrl';

const appName = 'Titan';
const defaultDescription =
  'Titan is a professional personal life operating system that unifies tasks, money, and thoughts into one connected, offline-first workspace.';
const defaultKeywords =
  'life management system, personal OS, productivity app, task manager, expense tracker, note taking app, connected life system, Titan PWA';
const defaultImage = '/Opengraph.png';

interface SeoConfig {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string;
  faqs?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; item: string }[];
}

function upsertMeta(selector: string, attr: 'name' | 'property', value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', url);
}

function upsertJsonLd(data: object, id: string) {
  let element = document.getElementById(id) as HTMLScriptElement;

  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.text = JSON.stringify(data);
}

function resolveAbsoluteUrl(value: string, baseUrl: string) {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return `${baseUrl.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
  }
}

export function useSeo({ title, description, path, image, keywords, faqs, breadcrumbs }: SeoConfig) {
  useEffect(() => {
    const pageTitle = `${title} | ${appName}`;
    const resolvedDescription = description ?? defaultDescription;
    const resolvedImage = image ?? defaultImage;
    const resolvedKeywords = keywords ?? defaultKeywords;
    const baseUrl = getPublicUrlBase();
    const resolvedPath = path ?? window.location.pathname;
    const resolvedUrl = resolveAbsoluteUrl(resolvedPath, baseUrl);
    const resolvedImageUrl = resolveAbsoluteUrl(resolvedImage, baseUrl);

    document.title = pageTitle;

    // Standard Meta Tags
    upsertMeta('meta[name="title"]', 'name', 'title', pageTitle);
    upsertMeta('meta[name="description"]', 'name', 'description', resolvedDescription);
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', resolvedKeywords);
    upsertMeta('meta[name="author"]', 'name', 'author', appName);

    // OpenGraph
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', resolvedDescription);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', resolvedImageUrl);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', resolvedUrl);
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', appName);

    // Twitter
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', resolvedDescription);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedImageUrl);

    upsertCanonical(resolvedUrl);

    // Structured Data (JSON-LD)
    const structuredData: any = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": `${baseUrl}#website`,
          "name": appName,
          "description": resolvedDescription,
          "url": resolvedUrl,
          "applicationCategory": "ProductivityApplication",
          "operatingSystem": "Web, Android, iOS, Windows, macOS",
          "author": {
            "@type": "Organization",
            "name": "Titan"
          },
          "image": resolvedImageUrl,
          "featureList": "Task Management, Financial Tracking, Note Taking, Connected Ecosystem",
          "screenshot": resolvedImageUrl
        }
      ]
    };

    if (faqs && faqs.length > 0) {
      structuredData["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      structuredData["@graph"].push({
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((bc, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": bc.name,
          "item": bc.item.startsWith('http') ? bc.item : resolveAbsoluteUrl(bc.item, baseUrl)
        }))
      });
    }

    upsertJsonLd(structuredData, 'titan-jsonld');

  }, [description, image, keywords, path, title]);
}
