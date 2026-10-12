import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "@/services/firebase";

/** Registers a new user with email/password. Throws on failure
 *  (e.g. email already in use, weak password, network error). */
export async function registerUser(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/** Logs in an existing user with email/password. Throws on invalid
 *  credentials or network error. */
export async function loginWithEmailPassword(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/** Logs out the current user. */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribes to auth state changes (login/logout), firing immediately
 * with the current user (or null). Returns an unsubscribe function —
 * call it in a useEffect cleanup to avoid leaking the listener.
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Returns the current user's Firebase ID token, used to authenticate
 * requests to our own backend (see services/api.ts). Returns null if
 * no one is logged in.
 */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
