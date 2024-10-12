// index.ts - CLI application for Blog management

import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import { BlogDAO } from './dao.ts';


class BlogCLI {
    private rl: readline.Interface;
    private dao: BlogDAO;

    constructor() {
      this.rl = readline.createInterface({ input, output });
      this.dao = new BlogDAO('blog.db'); // Use a persistent database file

      // Ensure clean shutdown
      process.on('SIGINT', () => this.cleanup());
      process.on('SIGTERM', () => this.cleanup());
    }

    private cleanup(): void {
        console.log('\nClosing application...');
        this.rl.close();
        this.dao.close();
        process.exit(0);
    }
  
    private async question(prompt: string): Promise<string> {
      return new Promise((resolve) => {
        this.rl.question(prompt, resolve);
      });
    }

    private displayPost(post) {
        console.log(`ID: ${post.id}`);
        console.log(`Title: ${post.title}`);
        console.log(`Content: ${post.content}`);
        console.log(`Created At: ${post.createdAt}`);
        console.log(`Updated At: ${post.updatedAt}`);
        console.log('---');
    }
  
    private async displayMenu() {
      console.log('\n=== Blog CLI Menu ===');
      console.log('1. List all posts');
      console.log('2. Create new post');
      console.log('3. View post');
      console.log('4. Update post');
      console.log('5. Delete post');
      console.log('6. Exit');

      const choice = await this.question('Enter your choice (1-6): ');
      await this.handleMenuChoice(choice);
    }

    private async handleMenuChoice(choice: string) {
        try {
            switch (choice) {
                case '1':
                    await this.listPosts();
                    break;
                case '2':
                    await this.createPost();
                    break;
                case '3':
                    await this.viewPost();
                    break;
                case '4':
                    await this.updatePost();
                    break;
                case '5':
                    await this.deletePost();
                    break;
                case '6':
                    this.cleanup();
                    break;
                default:
                    console.log('Invalid choice. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred:', error instanceof Error ? error.message : 'Unknown error');
        }

        if (choice !== '6') {
            await this.displayMenu();
        }
    }
  
    private async listPosts() {
        const posts = this.dao.getAllPosts();
        if (posts.length === 0) {
            console.log('No posts found.');
            return;
        }
        posts.forEach(this.displayPost);
    }
  
    private async createPost() {
        const title = await this.question('Enter post title: ');
        const content = await this.question('Enter post content: ');
        const post = this.dao.createPost(title, content);
        console.log('Post created successfully!');
        this.displayPost(post);
    }
  
    private async viewPost() {
        const idString = await this.question('Enter post ID to view: ');
        const id = parseInt(idString, 10);
        if (isNaN(id)) {
            console.log('Invalid post ID.');
            return;
        }
        const post = this.dao.getPost(id);
        if (!post) {
            console.log('Post not found.');
            return;
        }
        this.displayPost(post);
    }

    private async updatePost() {
        const idString = await this.question('Enter post ID to update: ');
        const id = parseInt(idString, 10);
        if (isNaN(id)) {
            console.log('Invalid post ID.');
            return;
        }

        const existingPost = this.dao.getPost(id);
        if (!existingPost) {
            console.log('Post not found.');
            return;
        }

        const title = await this.question(`Enter new title (leave blank to keep "${existingPost.title}"): `);
        const content = await this.question(`Enter new content (leave blank to keep current content): `);

        const success = this.dao.updatePost(id, title || existingPost.title, content || existingPost.content);

        if (success) {
            console.log('Post updated successfully!');
            this.displayPost(this.dao.getPost(id));
        } else {
            console.log('Failed to update post.');
        }
    }
  
    private async deletePost() {
        const idString = await this.question('Enter post ID to delete: ');
        const id = parseInt(idString, 10);
        if (isNaN(id)) {
            console.log('Invalid post ID.');
            return;
        }
        const success = this.dao.deletePost(id);
        if (success) {
            console.log('Post deleted successfully!');
        } else {
            console.log('Post not found.');
        }
    }


    public async start() {
        console.log('Welcome to the Blog CLI Application!');
        await this.displayMenu();
    }
}
  
// Start the application
const cli = new BlogCLI();
cli.start().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});