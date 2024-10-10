/**
 * Server-side actions for Todo API.
 * 
 * These actions handle CRUD (Create, Read, Update, Delete) operations for Todo items.
 */

"use server";

import { dao } from "@/app/todo/dao"; // Import Todo DAO (Data Access Object) for database interactions
import { revalidatePath } from "next/cache"; // Import revalidatePath function for Next.js caching

/**
 * Creates a new Todo item.
 * 
 * @param previousState The previous state of the application.
 * @param formData The form data containing the new Todo item details.
 */
export async function createTask(previousState: any, formData: FormData) {
  // Log the previous state and form data for debugging purposes
  console.log('previousState:', previousState);
  console.log('createTodo:', formData);

  // Extract the title from the form data
  const title = formData.get("title") as string;

  // Add the new Todo item to the database
  dao.addTask(title);

  // Revalidate the Next.js cache after creating a new Todo item
  revalidatePath("/");
}

/**
 * Finds a Todo item by its title.
 * 
 * @param previousState The previous state of the application.
 * @param formData The form data containing the search query.
 */
export async function findTask(previousState: any, formData: FormData) {
  // Extract the search query from the form data
  const content = formData.get("content") as string;

  // Find the Todo item by its title in the database
  const result = dao.findTasksByTitle(content);

  // Log the result for debugging purposes
  console.log(result);

  // Return the result
  return result;
}

/**
 * Deletes a Todo item by its ID.
 * 
 * @param id The ID of the Todo item to delete.
 */
export async function deleteTask(id: number) {
  // Delete the Todo item from the database
  dao.deleteTask(id);

  // Revalidate the Next.js cache after deleting a Todo item
  revalidatePath("/");
}

export async function completeTask(id: number) {
  dao.markTaskCompleted(id);
  revalidatePath("/");
}

// actions.ts - Add these new actions
export async function addTagToTask(taskId: number, previousState: any, formData: FormData) {
  const tag = formData.get("tag") as string;
  const success = dao.addTag(taskId, tag);
  if (success) {
    revalidatePath("/");
  }
  return success;
}

export async function removeTagFromTask(taskId: number, tag: string) {
  const success = dao.removeTag(taskId, tag);
  if (success) {
    revalidatePath("/");
  }
  return success;
}

export async function findTasksByTagName(previousState: any, formData: FormData) {
  const tag = formData.get("tag") as string;
  return dao.findTasksByTag(tag);
}