import 'server-only';
// dao.ts - Data Access Object for interacting with the SQLite database for users

import Database, { SqliteError } from 'better-sqlite3';
import { z } from 'zod';

// Define the User schema using Zod for validation and type safety
const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  passwordHash: z.string(),
});

// Type alias for User based on the schema
export type User = z.infer<typeof userSchema>;

export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
};

/**
 * Parses an array of unknown objects into an array of User objects 
 * using the userSchema for validation.
 * @param users - An array of objects to be parsed.
 * @returns An array of User objects.
 */
function parsedUsers(users: unknown[]) {
  return users.map((user) => userSchema.parse(user));
}

// Create a new SQLite database instance with the filename 'users.db'
const db = new Database('users.db');

// Enable Write-Ahead Logging for improved performance and concurrency
db.pragma('journal_mode = WAL');

// Create the users table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL
  )
`);

/**
 * Retrieves all users from the database.
 * @returns An array of User objects.
 */
const getAllUsers = (): User[] => {
  const users = db.prepare('SELECT * FROM users').all();
  return parsedUsers(users);
};

/**
 * Adds a new user to the database.
 * @param username - The username of the new user.
 * @param passwordHash - The hashed password of the new user.
 * @returns The result of the database operation.
 */
const addUser = (username: string, passwordHash: string) => {
  const stmt = db.prepare('INSERT INTO users (username, passwordHash) VALUES (?, ?)');
  try {
    const result = stmt.run(username, passwordHash);
    return { success: true, message: 'User added successfully' };
  } catch (error) {
    if (error instanceof SqliteError) {
      console.log(error.message);
      return { success: false, message: error.message};
    }
    throw error;
  }
};

/**
 * Updates a user's password hash.
 * @param id - The ID of the user to update.
 * @param newPasswordHash - The new hashed password.
 * @returns The result of the database operation.
 */
const updateUserPassword = (id: number, newPasswordHash: string) => {
  const stmt = db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?');
  return stmt.run(newPasswordHash, id);
};

/**
 * Deletes a user from the database.
 * @param id - The ID of the user to delete.
 * @returns The result of the database operation.
 */
const deleteUser = (id: number) => {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  return stmt.run(id);
};

/**
 * Finds a user by their ID.
 * @param id - The ID of the user to find.
 * @returns The User object if found, otherwise undefined.
 */
const findUserById = (id: number): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const aUser = stmt.get(id);
  return aUser ? userSchema.parse(aUser) : undefined;
};

/**
 * Finds a user by their username.
 * @param username - The username of the user to find.
 * @returns The User object if found, otherwise undefined.
 */
const findUserByUsername = (username: string): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const aUser = stmt.get(username);
  return aUser ? userSchema.parse(aUser) : undefined;
};

/**
 * Finds users by username using a LIKE query (partial matches allowed).
 * @param username - The username pattern to search for.
 * @returns An array of User objects that match the pattern.
 */
const findUsersByUsernameLike = (username: string): User[] => {
  const stmt = db.prepare('SELECT * FROM users WHERE username LIKE ?');
  const users = stmt.all(`%${username}%`);
  return parsedUsers(users);
};

// Export the data access functions and the close function
export default {
  getAllUsers,
  addUser,
  updateUserPassword,
  deleteUser,
  findUserById,
  findUserByUsername,
  findUsersByUsernameLike,
  close: () => db.close(),
};