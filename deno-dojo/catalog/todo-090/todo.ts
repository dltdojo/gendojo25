// todo.ts
import { TaskDAO } from "@/todo-dao.ts";

async function prompt(message: string = ""): Promise<string> {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(message + ": "));
  const n = <number>await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
}

async function main() {
  const dbPath = "./todo.db";
  const dao = new TaskDAO();
  await dao.init(dbPath)

  while (true) {
    console.log("\nTodo Menu:");
    console.log("1. Create Task");
    console.log("2. View Task");
    console.log("3. View All Tasks");
    console.log("4. Complete Task");
    console.log("5. Delete Task");
    console.log("6. Exit");

    const choice = await prompt("Enter your choice");

    switch (choice) {
      case "1": {
        const title = await prompt("Task Title");
        const id = dao.createTask(title);
        console.log(`Task created with id: ${id}`);
        break;
      }
      case "2": {
        const id = await prompt("Enter Task ID");
        const task = await dao.getTaskById(id);
        if (task) {
          console.log(`\nTitle: ${task.title}`);
          console.log(`Completed: ${task.completed ? "Yes" : "No"}`);
        } else {
          console.log("Task not found.");
        }
        break;
      }
      case "3": {
        const tasks = await dao.getAllTasks();
        if (tasks.length === 0) {
          console.log("No tasks found.");
        } else {
          tasks.forEach((task) => {
            console.log(`\nID: ${task.id}`);
            console.log(`Title: ${task.title}`);
            console.log(`Completed: ${task.completed ? "Yes" : "No"}`);
            console.log("---");
          });
        }
        break;
      }
      case "4": {
        const id = await prompt("Enter Task ID to complete");
        await dao.completeTask(id);
        console.log("Task marked as complete.");
        break;
      }
      case "5": {
        const id = await prompt("Enter Task ID to delete");
        await dao.deleteTask(id);
        console.log("Task deleted successfully.");
        break;
      }
      case "6": {
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