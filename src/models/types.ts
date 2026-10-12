// Core data models for FinTrack.
// These mirror the documents stored in MongoDB Atlas App Services.

export type CategoryName =
  | "Groceries"
  | "Dining"
  | "Transportation"
  | "Subscriptions"
  | "Entertainment"
  | "Utilities"
  | "Uncategorized"
  | string; // allow user-defined custom categories

export interface Category {
  _id: string;
  ownerId: string;
  name: CategoryName;
  colorHex: string; // used for chart segments
  isDefault: boolean;
}

export interface Transaction {
  _id: string;
  ownerId: string;
  merchantName: string;
  amount: number; // stored as a positive number; sign handled by `type`
  type: "expense" | "income";
  categoryId: string | null; // null until categorized
  categorySource: "manual" | "rule" | "classifier" | null;
  date: string; // ISO 8601
  notes?: string;
}

export interface SavingsGoal {
  _id: string;
  ownerId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string; // ISO 8601
}

export interface CategorySpendingSummary {
  categoryId: string;
  categoryName: CategoryName;
  total: number;
}

export interface MonthlySpendingPoint {
  month: string; // e.g. "2026-09"
  total: number;
}
