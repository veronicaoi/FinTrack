// Merchant-name keyword -> category mapping for rule-based auto-categorization.
// Keys are lowercase substrings checked against the merchant name.
// Extend this dictionary as you encounter new merchants during testing.

export const CATEGORY_KEYWORDS: Record<string, string> = {
  // Groceries
  publix: "Groceries",
  kroger: "Groceries",
  "whole foods": "Groceries",
  walmart: "Groceries",
  aldi: "Groceries",
  "trader joe": "Groceries",

  // Dining
  starbucks: "Dining",
  dunkin: "Dining",
  chipotle: "Dining",
  mcdonald: "Dining",
  "chick-fil-a": "Dining",
  panera: "Dining",

  // Transportation
  shell: "Transportation",
  chevron: "Transportation",
  exxon: "Transportation",
  uber: "Transportation",
  lyft: "Transportation",

  // Subscriptions
  netflix: "Subscriptions",
  spotify: "Subscriptions",
  hulu: "Subscriptions",
  "amazon prime": "Subscriptions",

  // Utilities
  "duke energy": "Utilities",
  comcast: "Utilities",
  "at&t": "Utilities",
};
