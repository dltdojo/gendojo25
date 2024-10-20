import { TaskDAO } from "./todo-dao.ts";
import { afterEach, beforeEach, describe, expect, it } from "testlib";

describe("TaskDAO", () => {
    let dao: TaskDAO;
    const dbPath = ":memory:"; // Use in-memory database for testing

    beforeEach(() => {
        dao = new TaskDAO(dbPath);
    });

    afterEach(() => {
        dao.close();
    });

    it("should add a task", () => {
        const id = dao.createTask("Test Task");
        expect(id).toBeGreaterThan(0);

        const task = dao.getTaskById(id);
        expect(task).toBeDefined();
        if (task) { // needed for TypeScript type narrowing
            expect(task.title).toBe("Test Task");
            expect(task.completed).toBe(0);
        }
    });

    it("should get all tasks", () => {
        dao.createTask("Task 1");
        dao.createTask("Task 2");
        const tasks = dao.getAllTasks();
        expect(tasks.length).toBe(2);
        if (tasks.length === 2) {
            expect(tasks[0].title).toBe("Task 1");
            expect(tasks[1].title).toBe("Task 2");
        }
    });

    it("should mark a task as completed", () => {
        const id = dao.createTask("Test Task");
        const result = dao.completeTask(id);
        expect(result).toBe(true); // Check if the update was successful

        const task = dao.getTaskById(id);
        expect(task).toBeDefined();
        if (task) {
            expect(task.completed).toBe(1);
        }
    });

    it("should not mark a non-existent task as completed", () => {
        const result = dao.completeTask(999); // Non-existent ID
        expect(result).toBe(false); // Expect false as no rows were updated
    });

    it("should delete a task", () => {
        const id = dao.createTask("Test Task");
        const result = dao.deleteTask(id);
        expect(result).toBe(true); // Check if deletion successful
        const task = dao.getTaskById(id);
        expect(task).toBeUndefined();
    });

    it("should not delete a non-existent task", () => {
        const result = dao.deleteTask(999); //Non-existent ID
        expect(result).toBe(false); // Expect false as no rows were deleted
    });

    it("should return undefined for a non-existent task", () => {
        const task = dao.getTaskById(999); //Non-existent ID
        expect(task).toBeUndefined();
    });

    it("should handle empty database for getAllTasks", () => {
        const tasks = dao.getAllTasks();
        expect(tasks).toEqual([]); // Expect an empty array
    });

    it("should correctly retrieve completed status", () => {
        const id = dao.createTask("Test Task");
        let task = dao.getTaskById(id);
        if (task) expect(task.completed).toBe(0);

        dao.completeTask(id);
        task = dao.getTaskById(id);
        if (task) expect(task.completed).toBe(1);
    });
});
