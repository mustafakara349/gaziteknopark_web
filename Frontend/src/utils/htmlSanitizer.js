import DOMPurify from "dompurify";

/**
 * Normalizes external links in HTML:
 * 1. Prefixes links missing protocol (e.g. www.google.com -> https://www.google.com)
 * 2. Adds target="_blank" and rel="noopener noreferrer" to external links.
 */
export function formatContentLinks(html) {
  if (!html) return "";

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const anchors = doc.querySelectorAll("a");

    anchors.forEach((a) => {
      let href = (a.getAttribute("href") || "").trim();
      if (href) {
        // If link starts with www. or looks like a domain without http(s)://, mailto:, tel:, #, or relative /
        if (/^(www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i.test(href) && !/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(href)) {
          href = `https://${href}`;
          a.setAttribute("href", href);
        }

        // If link is external (starts with http:// or https://), open in new tab
        if (/^https?:\/\//i.test(href)) {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
      }
    });

    return doc.body.innerHTML;
  } catch {
    return html;
  }
}

/**
 * Sanitizes HTML content with DOMPurify and formats all links safely.
 */
export function sanitizeAndFormatHtml(html) {
  if (!html) return "";
  const formatted = formatContentLinks(html);
  return DOMPurify.sanitize(formatted, {
    ADD_ATTR: ["target", "rel"]
  });
}
