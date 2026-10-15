export interface FontEstimateConstraints {
  /** Available text width in logical pixels. */
  width: number;
  /** Preferred size for short text. */
  maxFontSize: number;
  /** Readability floor; longer text is truncated instead of shrinking further. */
  minFontSize: number;
  /** Maximum rendered lines before truncation. */
  maxLines: number;
  /**
   * Average glyph advance as a fraction of fontSize for the app's font.
   * ~0.55 for Merriweather regular; higher (~0.6-0.65) for bold/uppercase.
   */
  glyphWidthRatio?: number;
}

/**
 * Single-pass estimate of the largest font size that makes `text` fit into
 * `maxLines` lines of the given width. Counts manual line breaks per
 * paragraph, then scales linearly when more lines are needed, clamped to
 * `minFontSize`.
 */
export const estimateFontSize = (text: string, constraints: FontEstimateConstraints): number => {
  const { width, maxFontSize, minFontSize, maxLines, glyphWidthRatio = 0.55 } = constraints;

  if (!text) {
    return maxFontSize;
  }

  const charsPerLine = Math.max(1, Math.floor(width / (maxFontSize * glyphWidthRatio)));

  const linesNeeded = text.split("\n").reduce((total, line) => {
    return total + Math.max(1, Math.ceil(line.length / charsPerLine));
  }, 0);

  if (linesNeeded <= maxLines) {
    return maxFontSize;
  }

  return Math.max(minFontSize, maxFontSize * (maxLines / linesNeeded));
};
