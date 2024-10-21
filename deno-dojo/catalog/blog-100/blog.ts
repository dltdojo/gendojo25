// blog.ts
import { BlogDAO } from "@/blog-dao.ts";

async function prompt(message: string = ""): Promise<string> {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(message + ": "));
  const n = <number>await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
}

async function main() {
  const dbPath = "./blog.db"; // Changed to persistent storage
  const dao = new BlogDAO(dbPath);

  while (true) {
    console.log("\nBlog Menu:");
    console.log("1. Create Blog Post");
    console.log("2. View Blog Post");
    console.log("3. View All Blog Posts");
    console.log("4. Delete Blog Post");
    console.log("5. Exit");

    const choice = await prompt("Enter your choice");

    switch (choice) {
      case "1": {
        const title = await prompt("Post Title");
        const content = await prompt("Post Content");
        const id = dao.createBlogPost(title, content);
        console.log(`Blog post created with id: ${id}`);
        break;
      }
      case "2": {
        const id = parseInt(await prompt("Enter Post ID"));
        const post = dao.getBlogPostById(id);
        if (post) {
          console.log(`\nTitle: ${post.title}`);
          console.log(`Content: ${post.content}`);
          console.log(`Created At: ${post.createdAt}`);
        } else {
          console.log("Post not found.");
        }
        break;
      }
      case "3": {
        const posts = dao.getAllBlogPosts();
        if (posts.length === 0) {
          console.log("No blog posts found.");
        } else {
          posts.forEach((post) => {
            console.log(`\nID: ${post.id}`);
            console.log(`Title: ${post.title}`);
            console.log(`Content: ${post.content}`);
            console.log(`Created At: ${post.createdAt}`);
            console.log("---");
          });
        }
        break;
      }
      case "4": {
          const id = parseInt(await prompt("Enter Post ID to delete"));
          const success = dao.deleteBlogPost(id);
          if (success) {
            console.log("Blog post deleted successfully.");
          } else {
            console.log("Failed to delete blog post. Post might not exist.");
          }
          break;
      }
      case "5": {
        dao.close();
        console.log("Exiting...");
        return;
      }
      default: {
        console.log("Invalid choice. Please try again.");
      }
    }
  }
}

await main();