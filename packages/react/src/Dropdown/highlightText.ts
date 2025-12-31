export type HighlightSegment = {
  text: string;
  highlight: boolean;
};

/**
 * Splits the text into segments based on the keyword and marks which segments should be highlighted.
 * - If the keyword is empty or not found, returns a single non-highlighted segment.
 */
export function highlightText(
  text: string,
  keyword?: string,
): HighlightSegment[] {
  if (!text) return [];
  if (!keyword) return [{ text, highlight: false }];

  const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeKeyword})`, 'gi');
  const parts: HighlightSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(regex)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, matchIndex),
        highlight: false,
      });
    }

    parts.push({ text: match[0], highlight: true });
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return parts.length ? parts : [{ text, highlight: false }];
}
