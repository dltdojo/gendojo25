// dao.test.ts
import { BlogDAO, Post, postSchema } from './dao.ts';
import { it, describe, beforeEach, afterEach, expect } from 'vitest'

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
} 

describe('BlogDAO', () => {
    let dao: BlogDAO;
    const dbPath = ':memory:';
  
    beforeEach(() => {
      dao = new BlogDAO(dbPath);
    });
  
    afterEach(() => {
      dao.close();
    });

    it('should initialize the database', () => {
        const tableExists = dao.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='posts'").get();
        expect(tableExists).toBeTruthy();
    });
  
    it('should create a post', () => {
      const post = dao.createPost('Test Title', 'Test Content');
      expect(post).toMatchObject({ title: 'Test Title', content: 'Test Content' });
      expect(post.id).toBeGreaterThan(0);
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);

    });
  
    it('should get all posts', () => {
      dao.createPost('Post 1', 'Content 1');
      dao.createPost('Post 2', 'Content 2');
      const posts = dao.getAllPosts();
      expect(posts.length).toBe(2);
    });

    it('should get a post by ID', () => {
        const post = dao.createPost('Test Post', 'Test Content');
        const retrievedPost = dao.getPost(post.id);
        expect(retrievedPost).toMatchObject(post);
    });

    it('should update a post', () => {
        const post = dao.createPost('Original Title', 'Original Content');
        const success = dao.updatePost(post.id, 'Updated Title', 'Updated Content');
        expect(success).toBe(true);
        const updatedPost = dao.getPost(post.id);
        expect(updatedPost).toMatchObject({ title: 'Updated Title', content: 'Updated Content' });
    });
      
    it('should delete a post', () => {
        const post = dao.createPost('Test Post', 'Test Content');
        const success = dao.deletePost(post.id);
        expect(success).toBe(true);
        const deletedPost = dao.getPost(post.id);
        expect(deletedPost).toBeNull();
    });

    it('should handle timestamps correctly', async () => {
        const post = dao.createPost('Test Post', 'Test Content');
        const retrievedPostBeforeUpdate = dao.getPost(post.id);

        await delay(1000); // Introduce a delay to ensure updated timestamp is different

        const success = dao.updatePost(post.id, 'Updated Title', 'Updated Content');
        expect(success).toBeTruthy();

        const retrievedPostAfterUpdate = dao.getPost(post.id);
        if (retrievedPostAfterUpdate && retrievedPostBeforeUpdate) {
          expect(retrievedPostAfterUpdate.updatedAt.getTime()).toBeGreaterThan(retrievedPostBeforeUpdate.updatedAt.getTime());
        }
    });
});
  