import { MongoClient } from "mongodb";

let client;
let db;

/** Connects to MongoDB Atlas once and caches the connection.
 *  Call this at server startup before handling any requests. */
export async function connectToDatabase() {
  if (db) return db;

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db("fintrack");
  console.log("Connected to MongoDB Atlas.");
  return db;
}

/** Returns the cached database handle. Throws if called before
 *  connectToDatabase() has completed — this is a signal that
 *  something is calling a route handler before startup finished. */
export function getDb() {
  if (!db) {
    throw new Error("Database not connected yet. Call connectToDatabase() first.");
  }
  return db;
}
