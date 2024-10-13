import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import TaskDAO from './dao.ts';

const rl = readline.createInterface({ input, output });
const dao = new TaskDAO('todo.db');

async function question(prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

async function main() {
  while (true) {
    console.log('\n1. List tasks');
    console.log('2. Add task');
    console.log('3. Complete task');
    console.log('4. Delete task');
    console.log('5. Exit');

    const choice = await question('> ');

    switch (choice) {
      case '1':
        dao.getAllTasks().forEach(task => {
          console.log(`${task.id}. [${task.completed ? 'x' : ' '}] ${task.title}`);
        });
        break;
      case '2':
        const title = await question('Title: ');
        dao.addTask(title);
        console.log('Task added.');
        break;
      case '3':
        const idComplete = parseInt(await question('ID to complete: '), 10);
        dao.markTaskCompleted(idComplete);
        console.log('Task completed.');
        break;
      case '4':
        const idDelete = parseInt(await question('ID to delete: '), 10);
        dao.deleteTask(idDelete);
        console.log('Task deleted.');
        break;
      case '5':
        dao.close();
        rl.close();
        process.exit(0);
      default:
        console.log('Invalid choice.');
    }
  }
}

main();