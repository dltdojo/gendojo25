// dao.test.ts
import { TaskDAO } from './dao.ts';
import { describe, it, beforeEach, afterEach } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

describe('TaskDAO', () => {
    let dao: TaskDAO;
    const dbPath = ':memory:'; // Use in-memory database for testing

    beforeEach(() => {
        dao = new TaskDAO(dbPath);
    });

    afterEach(() => {
        dao.close();
    });

    it('should add a task', () => {
        const id = dao.addTask('Test Task');
        expect(id).toBeGreaterThan(0);

        const task = dao.findTaskById(id);
        expect(task).toBeDefined();
        if (task) { // needed for TypeScript type narrowing
            expect(task.title).toBe('Test Task');
            expect(task.completed).toBe(0);
        }
    });

    it('should get all tasks', () => {
        dao.addTask('Task 1');
        dao.addTask('Task 2');
        const tasks = dao.getAllTasks();
        expect(tasks.length).toBe(2);
    });

    it('should mark a task as completed', () => {
        const id = dao.addTask('Test Task');
        dao.markTaskCompleted(id);
        const task = dao.findTaskById(id);

        expect(task).toBeDefined();
        if(task) {
            expect(task.completed).toBe(1);
        }
    });

    it('should delete a task', () => {
        const id = dao.addTask('Test Task');
        dao.deleteTask(id);
        const task = dao.findTaskById(id);
        expect(task).toBeUndefined();
    });

    // Add more tests as needed...
});