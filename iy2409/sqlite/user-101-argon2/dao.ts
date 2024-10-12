// dao.ts - Data Access Object for interacting with the SQLite database for users

import Database, { SqliteError } from 'libsql';
import { z } from 'zod';

// Define the User schema using Zod for validation and type safety
const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  passwordHash: z.string(),
});

// Type alias for User based on the schema
export type User = z.infer<typeof userSchema>;

export class UserDao {
  private db;

  constructor(filename = 'users.db') {
    this.db = new Database(filename);
    this.db.pragma('journal_mode = WAL');
    this.createTable();
  }

  private createTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL
      )
    `);
  }

  private parsedUsers(users: unknown[]) {
    return users.map((user) => userSchema.parse(user));
  }


  getAllUsers(): User[] {
    const users = this.db.prepare('SELECT * FROM users').all();
    return this.parsedUsers(users);
  }

  addUser(username: string, passwordHash: string) {
    const stmt = this.db.prepare('INSERT INTO users (username, passwordHash) VALUES (?, ?)');
    try {
      const result = stmt.run(username, passwordHash);
      return { success: true, message: 'User added successfully' };
    } catch (error) {
      if (error instanceof SqliteError) {
        console.error(error.message); // Use console.error for errors
        return { success: false, message: error.message };
      } else {
        throw error;
      }
    }
  }


  updateUserPassword(id: number, newPasswordHash: string) {
    const stmt = this.db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?');
    return stmt.run(newPasswordHash, id);
  }

  deleteUser(id: number) {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }

  findUserById(id: number): User | undefined {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const aUser = stmt.get(id);
    return aUser ? userSchema.parse(aUser) : undefined;
  }

  findUserByUsername(username: string): User | undefined {
    const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
    const aUser = stmt.get(username);
    return aUser ? userSchema.parse(aUser) : undefined;
  }

  findUsersByUsernameLike(username: string): User[] {
    const stmt = this.db.prepare('SELECT * FROM users WHERE username LIKE ?');
    const users = stmt.all(`%${username}%`);
    return this.parsedUsers(users);
  }

  close() {
    this.db.close();
  }
}