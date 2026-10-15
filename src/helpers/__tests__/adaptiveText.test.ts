/// <reference types="jest" />
import { estimateFontSize } from "../adaptive-text";

const constraints = {
  width: 285,
  maxFontSize: 26,
  minFontSize: 14,
  maxLines: 12,
  glyphWidthRatio: 0.55,
};

// charsPerLine at maxFontSize: floor(285 / (26 * 0.55)) = 19
const CHARS_PER_LINE = 19;

describe("estimateFontSize", () => {
  it("keeps the preferred size for short text", () => {
    expect(estimateFontSize("hello", constraints)).toBe(26);
  });

  it("keeps the preferred size while the text fits within the line budget", () => {
    const fitsExactly = "a".repeat(CHARS_PER_LINE * constraints.maxLines);
    expect(estimateFontSize(fitsExactly, constraints)).toBe(26);
  });

  it("scales down proportionally when more lines are needed", () => {
    const linesNeeded = 16;
    const text = "a".repeat(CHARS_PER_LINE * linesNeeded);
    expect(estimateFontSize(text, constraints)).toBeCloseTo(26 * (12 / 16));
  });

  it("never shrinks below the readability floor", () => {
    const veryLong = "a".repeat(CHARS_PER_LINE * 60);
    expect(estimateFontSize(veryLong, constraints)).toBe(14);
  });

  it("counts manual line breaks per paragraph", () => {
    // Two explicit lines of 20 chars each -> 2 + 2 = 4 lines needed.
    const text = `${"a".repeat(20)}\n${"a".repeat(20)}`;
    expect(estimateFontSize(text, constraints)).toBe(26);
    // Three paragraphs of 40 chars each -> ceil(40/19)*3 = 9 lines.
    const multiParagraph = `${"a".repeat(40)}\n${"a".repeat(40)}\n${"a".repeat(40)}`;
    expect(estimateFontSize(multiParagraph, constraints)).toBe(26);
  });

  it("returns the preferred size for empty text", () => {
    expect(estimateFontSize("", constraints)).toBe(26);
  });

  it("produces a size no larger for a longer string at the same width", () => {
    const short = estimateFontSize("привет", constraints);
    const long = estimateFontSize("привет, как дела в этом прекрасном мире", constraints);
    expect(long).toBeLessThanOrEqual(short);
  });
});
