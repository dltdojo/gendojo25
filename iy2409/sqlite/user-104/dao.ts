// dao.ts - Data Access Object for interacting with the SQLite database for users

import Database, { SqliteError } from 'libsql';
import { z } from 'zod';

// Define the User schema using Zod for validation and type safety
export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(3).max(50),
  passwordHash: z.string(),
  createdAt: z.coerce.date(), // Use .coerce.date() from zod
  updatedAt: z.coerce.date(), 
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

// Role schema and type
export const roleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
});

export type Role = z.infer<typeof roleSchema>;

// UserRole schema and type (maps users to roles)
export const userRoleSchema = z.object({
  userId: z.number().int().positive(),
  roleId: z.number().int().positive(),
});
export type UserRole = z.infer<typeof userRoleSchema>;



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
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastLogin DATETIME,
        failedLoginAttempts INTEGER DEFAULT 0
      );
      CREATE TRIGGER IF NOT EXISTS update_user_updated_at
      AFTER UPDATE OF username, passwordHash ON users
      BEGIN
        UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_roles (
        userId INTEGER NOT NULL,
        roleId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
        UNIQUE (userId, roleId)  -- Ensure a user has each role only once
      );
    `);

    // Insert default roles if they don't exist
    const adminRoleExists = this.db.prepare('SELECT 1 FROM roles WHERE name = ?').get('admin');
    if (!adminRoleExists) {
      this.db.prepare('INSERT INTO roles (name) VALUES (?)').run('admin');
    }
    const userRoleExists = this.db.prepare('SELECT 1 FROM roles WHERE name = ?').get('user');
    if (!userRoleExists) {
      this.db.prepare('INSERT INTO roles (name) VALUES (?)').run('user');
    }
  }

  private parsedUsers(users: unknown[]) {
    return users.map((user) => userSchema.parse(user));
  }

  getAllUsers(): User[] {
    const users = this.db.prepare('SELECT * FROM users').all();
    return this.parsedUsers(users);
  }

  addUser(username: string, passwordHash: string): { success: boolean; message: string; userId?: number } {
    try {
      const insertResult = this.db.prepare('INSERT INTO users (username, passwordHash) VALUES (?, ?)').run(username, passwordHash);
      return { success: true, message: 'User added successfully', userId: insertResult.lastInsertRowid as number }; // Return the userId
    } catch (error) {
      if (error instanceof SqliteError && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, message: 'Username already exists' };
      }
      return { success: false, message: error.message };
    }
  }

  addRole(roleName: string): { success: boolean; message: string } {
    try {
      this.db.prepare('INSERT INTO roles (name) VALUES (?)').run(roleName);
      return { success: true, message: 'Role added successfully' };
    } catch (error) {
      return { success: false, message: error.message }; // Handle errors appropriately
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

  assignRoleToUser(userId: number, roleId: number): { success: boolean; message: string } {
    try {
      this.db.prepare('INSERT INTO user_roles (userId, roleId) VALUES (?, ?)').run(userId, roleId);
      return { success: true, message: 'Role assigned to user successfully' };
    } catch (error) {
      if (error instanceof SqliteError && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, message: 'User already has this role' }; // More specific error message
      }
      return { success: false, message: error.message };

    }
  }

  getRoleByName(roleName: string): Role | undefined {
    const stmt = this.db.prepare('SELECT * FROM roles WHERE name = ?');
    const aRole = stmt.get(roleName);
    return aRole ? roleSchema.parse(aRole) : undefined;
  }

  getUserRoles(userId: number): Role[] {
    const roles = this.db.prepare(`
      SELECT r.id, r.name
      FROM roles r
      JOIN user_roles ur ON r.id = ur.roleId
      WHERE ur.userId = ?
    `).all(userId);
    return roles.map((role) => roleSchema.parse(role)); // Use roleSchema to parse
  }

  close() {
    this.db.close();
  }
}