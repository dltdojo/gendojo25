// dao.ts - Data Access Object for interacting with the SQLite database for users

import Database, { SqliteError } from 'libsql';
import { z } from 'zod';

// Define the User schema using Zod for validation and type safety
export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(3).max(50),
  passwordHash: z.string(),
  createdAt: z.coerce.date(), // Use .coerce.date() from zod
  updatedAt: z.coerce.date().nullable(),
  lastLogin: z.coerce.date().nullable(), // Use .coerce.date().nullable() from zod
  failedLoginAttempts: z.number().int().min(0),
});

// Type alias for User based on the schema
export type User = z.infer<typeof userSchema>;

// Add password validation schema
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export type Password = z.infer<typeof passwordSchema>;

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
        passwordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME,  -- Add updatedAt column
        lastLogin DATETIME,
        failedLoginAttempts INTEGER DEFAULT 0
      );
      CREATE TRIGGER IF NOT EXISTS update_user_updated_at  -- Add this trigger
      AFTER UPDATE OF username, passwordHash ON users
      BEGIN
        UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
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
    try {
      const result = this.db.prepare('INSERT INTO users (username, passwordHash) VALUES (?, ?)').run(username, passwordHash);
      return { success: true, message: 'User added successfully' };
    } catch (error) {
      if (error instanceof SqliteError && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, message: 'Username already exists' };
      }
      return { success: false, message: error.message };
    }
  }

  updateLastLogin(userId: number) {
    try {
      const stmt = this.db.prepare('UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?');
      const result = stmt.run(userId);
      console.log("Updated lastLogin:", result); // Check if the update was successful
      return { success: true, message: 'Last login updated successfully' };
    } catch (error) {
      console.error("Error updating lastLogin:", error); // Log any errors
      return { success: false, message: error.message };
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

  incrementFailedLoginAttempts(userId: number) {
    try {
      const selectStmt = this.db.prepare('SELECT failedLoginAttempts FROM users WHERE id = ?');
      const user = selectStmt.get(userId);

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const newFailedAttempts = user.failedLoginAttempts + 1;
      const updateStmt = this.db.prepare('UPDATE users SET failedLoginAttempts = ? WHERE id = ?');
      updateStmt.run(newFailedAttempts, userId);
      return { success: true, failedAttempts: newFailedAttempts, message: 'Failed attempts incremented' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  resetFailedLoginAttempts(userId: number) {
    try {
      const stmt = this.db.prepare('UPDATE users SET failedLoginAttempts = 0 WHERE id = ?');
      stmt.run(userId);
      return { success: true, message: 'Failed login attempts reset' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  isAccountLocked(userId: number): boolean {
    try {
      const stmt = this.db.prepare('SELECT failedLoginAttempts FROM users WHERE id = ?');
      const user = stmt.get(userId);
      return user ? user.failedLoginAttempts >= 3 : false; // Account is locked if attempts are 3 or more
    } catch (error) {
      console.error("Error checking account lock status:", error);
      return false; // Default to not locked if there's an error
    }
  }


  close() {
    this.db.close();
  }
}