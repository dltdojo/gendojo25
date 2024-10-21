import { TaskDAO } from "@/todo-dao.ts";
import { afterEach, beforeEach, describe, expect, it } from "testlib";

describe("TaskDAO", () => {
    let dao: TaskDAO;
    const dbPath = ":memory:"; // Use in-memory database for testing

    beforeEach(async () => {
        dao = new TaskDAO();
        await dao.init(dbPath);
    });

    afterEach(() => {
        dao.close();
    });

    it("should add a task", async () => {
        const id = await dao.createTask("Test Task");
        expect(id).toBeDefined();

        const task = await dao.getTaskById(id);
        expect(task).toBeDefined();
        if (task) {
            expect(task.title).toBe("Test Task");
            expect(task.completed).toBe(false);
        }
    });

    it("should get all tasks", async () => {
        await dao.createTask("Task 1");
        await dao.createTask("Task 2");
        const tasks = await dao.getAllTasks();
        expect(tasks.length).toBe(2);
    });

    it("should mark a task as completed", async () => {
        const id = await dao.createTask("Test Task");
        await dao.completeTask(id);
        const task = await dao.getTaskById(id);
        expect(task).toBeDefined();
        if (task) {
            expect(task.completed).toBeTruthy();
        }
    });

    it("should not mark a non-existent task as completed", async() => {
        // Non-existent ID
        await expect(dao.completeTask("999")).rejects.toThrow("Task not found"); // Expect false as no rows were updated
    });

    it("should delete a task", async () => {
        const id = await dao.createTask("Test Task");
        await dao.deleteTask(id);
        await expect(dao.getTaskById(id)).rejects.toThrow("Task not found");
    });

    it("should not delete a non-existent task", async () => {
        const result = await dao.deleteTask("999"); //Non-existent ID
        expect(result).toBeUndefined()
    });

    it("should return undefined for a non-existent task", async() => {
        await expect(dao.getTaskById("999")).rejects.toThrow("Task not found");
    });

    it("should handle empty database for getAllTasks", async () => {
        const tasks = await dao.getAllTasks();
        expect(tasks).toEqual([]); // Expect an empty array
    });

    it("should correctly retrieve completed status", async () => {
        const id = await dao.createTask("Test Task");
        let task = await dao.getTaskById(id);
        if (task) expect(task.completed).toBe(false);
        await dao.completeTask(id);
        task = await dao.getTaskById(id);
        if (task) expect(task.completed).toBe(true);
    });
});
