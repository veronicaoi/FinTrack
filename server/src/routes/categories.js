import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";

const router = express.Router();

// GET /categories — list the authenticated user's categories
router.get("/", async (req, res) => {
    const db = getDb();
    const categories = await db
        .collection("categories")
        .find({ ownerId: req.userId })
        .sort({ name: 1 })
        .toArray();

    res.json(categories);
});

// POST /categories — create a new category
router.post("/", async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "name is required." });
    }

    const db = getDb();
    const result = await db.collection("categories").insertOne({
        ownerId: req.userId,
        name: name.trim(),
        createdAt: new Date(),
    });

    res.status(201).json({ insertedId: result.insertedId });
});

// DELETE /categories/:id — remove a category (only if it belongs to this user)
router.delete("/:id", async (req, res) => {
    const db = getDb();
    const result = await db.collection("categories").deleteOne({
        _id: new ObjectId(req.params.id),
        ownerId: req.userId,
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Category not found." });
    }

    res.status(204).send();
});

export default router;