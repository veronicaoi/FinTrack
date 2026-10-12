import { format } from "date-fns";

export interface TransactionLike {
    amount: number;
    category: string;
    createdAt: string; // ISO date string from the API
}

export interface CategoryTotal {
    category: string;
    total: number;
}

export interface DailyTotal {
    label: string; // e.g. "09/21"
    total: number;
}

/** Sums spending per category, largest first. */
export function totalsByCategory(transactions: TransactionLike[]): CategoryTotal[] {
    const totals: Record<string, number> = {};
    for (const t of transactions) {
        totals[t.category] = (totals[t.category] ?? 0) + t.amount;
    }
    return Object.entries(totals)
        .map(([category, total]) => ({ category, total }))
        .sort((a, b) => b.total - a.total);
}

/** Sums spending per day (local time), oldest to newest, last `maxDays` days with data. */
export function totalsByDay(transactions: TransactionLike[], maxDays = 7): DailyTotal[] {
    const totals: Record<string, number> = {};
    for (const t of transactions) {
        const day = format(new Date(t.createdAt), "yyyy-MM-dd");
        totals[day] = (totals[day] ?? 0) + t.amount;
    }
    return Object.entries(totals)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-maxDays)
        .map(([day, total]) => ({ label: day.slice(5).replace("-", "/"), total }));
}