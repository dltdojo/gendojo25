// dao.ts
import Database from 'libsql';
import { z } from 'zod';

export const postSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const postSqliteSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});


export type Post = z.infer<typeof postSchema>;
type PostSqlite = z.infer<typeof postSqliteSchema>;

function transformPost(post: PostSqlite): Post {
    return {
      ...post,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at)
    };
}

function parsePosts(posts: PostSqlite[]): Post[] {
    return posts.map((post) => postSchema.parse(transformPost(post)));
}

export class BlogDAO {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize() {
    this.db.pragma('journal_mode = WAL');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        created_at DATETIME DEFAULT (unixepoch('now','subsec')),
        updated_at DATETIME DEFAULT (unixepoch('now','subsec'))
      )
    `);
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_post_timestamp 
      AFTER UPDATE ON posts
      BEGIN
        UPDATE posts SET updated_at = (unixepoch('now','subsec'))
        WHERE id = NEW.id;
      END;
    `);
  }

  getAllPosts(): Post[] {
    const stmt = this.db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
    return parsePosts(stmt.all() as PostSqlite[]);
  }

  getPost(id: number): Post | null {
    const stmt = this.db.prepare('SELECT * FROM posts WHERE id = ?');
    const post = stmt.get(id) as PostSqlite | undefined;
    return post ? postSchema.parse(transformPost(post)) : null;
  }


  createPost(title: string, content: string): Post {
    const stmt = this.db.prepare(`
        INSERT INTO posts (title, content)
        VALUES (?, ?)
        RETURNING *
    `);
    return postSchema.parse(transformPost(stmt.get(title, content) as PostSqlite));
}

  updatePost(id: number, title: string, content: string): boolean {
    const stmt = this.db.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?');
    const result = stmt.run(title, content, id);
    return result.changes > 0;
  }

  deletePost(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM posts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  close() {
    this.db.close();
  }
}