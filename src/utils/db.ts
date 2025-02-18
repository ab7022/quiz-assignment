import { openDB } from 'idb';
import type { QuizAttempt } from '../types';

const dbName = 'quizDB';
const storeName = 'attempts';

export async function initDB() {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName, { keyPath: 'id' });
    },
  });
  return db;
}

export async function saveAttempt(attempt: QuizAttempt) {
  const db = await initDB();
  await db.add(storeName, attempt);
}

export async function getAttempts(): Promise<QuizAttempt[]> {
  const db = await initDB();
  return db.getAll(storeName);
}