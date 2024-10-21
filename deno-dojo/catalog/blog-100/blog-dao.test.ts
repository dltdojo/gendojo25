// blog-dao.test.ts
import { BlogDAO, BlogPost } from "@/blog-dao.ts";
import { afterEach, beforeEach, describe, expect, it } from "testlib";


describe("BlogDAO", () => {
    let dao: BlogDAO;
    const dbPath = ":memory:";

    beforeEach(() => {
        dao = new BlogDAO(dbPath);
    });

    afterEach(() => {
        dao.close();
    });

    it("should create a blog post", () => {
        const id = dao.createBlogPost("Test Title", "Test Content");
        expect(id).toBeGreaterThan(0);
        const post = dao.getBlogPostById(id);
        expect(post).toBeDefined();
        if (post) {
            expect(post.title).toBe("Test Title");
            expect(post.content).toBe("Test Content");
        }

    });

    it("should get all blog posts", () => {
        dao.createBlogPost("Title 1", "Content 1");
        dao.createBlogPost("Title 2", "Content 2");
        const posts = dao.getAllBlogPosts();
        expect(posts.length).toBe(2);
        if (posts.length === 2) {
            expect(posts[0].title).toBe("Title 1");
            expect(posts[1].title).toBe("Title 2");
        }
    });


    it("should delete a blog post", () => {
        const id = dao.createBlogPost("Test Title", "Test Content");
        const result = dao.deleteBlogPost(id);
        expect(result).toBe(true);
        const post = dao.getBlogPostById(id);
        expect(post).toBeUndefined();
    });


    it("should return undefined for a non-existent post", () => {
        const post = dao.getBlogPostById(999);
        expect(post).toBeUndefined();
    });

    it("should handle empty database for getAllBlogPosts", () => {
        const posts = dao.getAllBlogPosts();
        expect(posts).toEqual([]);
    });

});