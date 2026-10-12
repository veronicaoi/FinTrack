import admin from "firebase-admin";

/**
 * Verifies the Firebase ID token sent in the Authorization header
 * (as "Bearer <token>"), which the mobile app attaches to every
 * request (see src/services/api.ts on the client).
 *
 * On success, attaches the verified Firebase user ID to req.userId
 * so route handlers know which user is making the request, without
 * this backend ever having to store or check passwords itself —
 * Firebase already confirmed who this is.
 */
export async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing Authorization token." });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
