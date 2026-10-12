import express from "express";
import { getDb } from "../db.js";

const router = express.Router();

// POST /transactions — create a new transaction for the authenticated user.
// Category is decided client-side (rule-based keyword match) for now;
// this route just stores whatever category string it's given.
router.post("/", async (req, res) => {
  const { merchantName, amount, category } = req.body;

  if (!merchantName || typeof amount !== "number") {
    return res.status(400).json({ error: "merchantName and a numeric amount are required." });
  }

  const db = getDb();
  const result = await db.collection("transactions").insertOne({
    ownerId: req.userId,
    merchantName,
    amount,
    category: category || "Uncategorized",
    createdAt: new Date(),
  });

  res.status(201).json({ insertedId: result.insertedId });
});

// GET /transactions — list the authenticated user's transactions, newest first.
router.get("/", async (req, res) => {
  const db = getDb();
  const transactions = await db
    .collection("transactions")
    .find({ ownerId: req.userId })
    .sort({ createdAt: -1 })
    .toArray();

  res.json(transactions);
});

export default router;
