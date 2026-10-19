export function extractArticleCandidates(text) {
  const candidates = new Set();
  const add = (value) => {
    const normalized = value.trim().replace(/[–—−]/g, "-").replace(/\s+/g, " ");
    if (
      normalized.length >= 3 &&
      normalized.length <= 80 &&
      /\d/.test(normalized) &&
      /^[A-Z0-9][A-Z0-9\s./_#()+-]*$/i.test(normalized)
    )
      candidates.add(normalized);
  };
  for (const line of text.split(/[\r\n]+/)) {
    const cleaned = line
      .trim()
      .replace(
        /^(?:PART\s*(?:NO\.?|NUMBER)|ART(?:ICLE)?\.?|P\s*\/\s*N|CODE|OEM?|NO\.?)(?=\s|[:#.]|$)\s*[:#.-]?\s*/i,
        "",
      );
    add(cleaned);
    if (!/\s/.test(cleaned) || candidates.has(cleaned)) continue;
    for (const token of cleaned.match(/[A-Z0-9][A-Z0-9./_#()-]{2,79}/gi) || [])
      add(token);
  }
  return [...candidates].slice(0, 8);
}
