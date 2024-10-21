// blog-dao.ts
import { Database } from "@db/sqlite";

export type BlogPost = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
};

export class BlogDAO {
  private db: Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  createBlogPost(title: string, content: string): number {
    this.db.prepare("INSERT INTO blog_posts (title, content) VALUES (?, ?)").run(
      title,
      content,
    );
    return this.db.lastInsertRowId;
  }

  getBlogPostById(id: number): BlogPost | undefined {
    const post = this.db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id);
    return post as BlogPost | undefined;
  }

  getAllBlogPosts(): BlogPost[] {
    return this.db.prepare("SELECT * FROM blog_posts").all() as BlogPost[];
  }

    deleteBlogPost(id: number): boolean {
        return this.db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id) > 0;
    }



  close(): void {
    this.db.close();
  }
}

export default BlogDAO;