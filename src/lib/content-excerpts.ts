export type ContentExcerptSource = {
  body?: string | null;
  data?: {
    voice?: string | null;
    summary?: string | null;
    description?: string | null;
  };
};

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

const stripMarkdown = (value: string) =>
  value
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1');

export const getBodyText = (value: string) => normalizeWhitespace(stripMarkdown(String(value || '')));

export const getBodyParagraphs = (value?: string | null) =>
  String(value || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((part) => normalizeWhitespace(stripMarkdown(part)))
    .filter(Boolean);

export const getTextExcerpt = (value: string, maxChars = 220) => {
  const text = getBodyText(value);
  if (!text) return '';
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trimEnd()}...`;
};

export const getBodyLead = (value?: string | null, maxChars = 220) => {
  const paragraphs = getBodyParagraphs(value);
  const lead = paragraphs[0] ?? '';
  if (!lead) return '';
  if (lead.length <= maxChars) return lead;
  return `${lead.slice(0, maxChars).trimEnd()}...`;
};

export const getContentVoiceExcerpt = (source: ContentExcerptSource, maxChars = 220) => {
  const explicitVoice = normalizeWhitespace(String(source.data?.voice || ''));
  if (explicitVoice) {
    return explicitVoice.length <= maxChars
      ? explicitVoice
      : `${explicitVoice.slice(0, maxChars).trimEnd()}...`;
  }

  const bodyLead = getBodyLead(source.body, maxChars);
  if (bodyLead) return bodyLead;

  const fallback = normalizeWhitespace(String(source.data?.summary || source.data?.description || ''));
  if (!fallback) return '';
  return fallback.length <= maxChars ? fallback : `${fallback.slice(0, maxChars).trimEnd()}...`;
};
