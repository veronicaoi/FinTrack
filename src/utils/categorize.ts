import { CATEGORY_KEYWORDS } from "@/data/categoryKeywords";

/**
 * Attempts to match a merchant name to a category using simple
 * substring matching against CATEGORY_KEYWORDS.
 *
 * Returns "Uncategorized" if no keyword matches.
 *
 * TODO: replace with a case-insensitive fuzzy match if exact
 * substring matching proves too strict during testing.
 */
export function categorizeByKeyword(merchantName: string): string {
  const normalized = merchantName.toLowerCase();

  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (normalized.includes(keyword)) {
      return category;
    }
  }

  return "Uncategorized";
}
