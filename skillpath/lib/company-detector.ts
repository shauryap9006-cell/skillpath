/**
 * Company Type Detector — uses local keyword matching to classify JD company type,
 * saving LLM tokens and latency.
 */

export function detectCompanyType(jdText: string): string {
  const text = jdText.toLowerCase();

  // Keyword heuristics
  if (
    text.includes("startup") ||
    text.includes("seed") ||
    text.includes("series a") ||
    text.includes("series b") ||
    text.includes("fast-paced") ||
    text.includes("equity")
  ) {
    return "startup";
  }

  if (
    text.includes("scale-up") ||
    text.includes("scaleup") ||
    text.includes("hyper-growth") ||
    text.includes("series c") ||
    text.includes("series d")
  ) {
    return "scaleup";
  }

  if (
    text.includes("agency") ||
    text.includes("clients") ||
    text.includes("consulting") ||
    text.includes("client-facing")
  ) {
    return "agency";
  }

  // Safe default
  return "enterprise";
}
