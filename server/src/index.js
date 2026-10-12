import "dotenv/config";
import { readFileSync } from "fs";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";

import { connectToDatabase } from "./db.js";
import { verifyFirebaseToken } from "./middleware/verifyFirebaseToken.js";
import transactionsRouter from "./routes/transactions.js";
import categoriesRouter from "./routes/categories.js";

// Firebase Admin is used only to VERIFY tokens issued by the client's
// Firebase Auth sign-in — this backend never sees or stores passwords.
// Download this JSON from: Firebase Console -> Project Settings ->
// Service Accounts -> Generate new private key.
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Every route below requires a valid Firebase ID token.
app.use("/transactions", verifyFirebaseToken, transactionsRouter);
app.use("/categories", verifyFirebaseToken, categoriesRouter);

const PORT = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`FinTrack API listening on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
