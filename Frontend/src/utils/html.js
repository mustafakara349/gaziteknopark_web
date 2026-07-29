/**
 * Splits a CMS-provided HTML string (e.g. "<p>...</p><p>...</p>") into its
 * paragraph inner-HTML fragments, without altering any of the original text.
 * Falls back to treating the whole string as a single paragraph if no <p>
 * tags are found.
 */
export function extractParagraphs(html) {
  if (!html) return [];
  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  if (matches.length === 0) return [html];
  return matches.map((match) => match[1]);
}
