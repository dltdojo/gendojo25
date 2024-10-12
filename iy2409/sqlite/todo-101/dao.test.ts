import TaskDAO, { Task, taskSchema } from './dao';
import { it, describe, beforeEach, afterEach, expect } from 'vitest'

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
} 

describe('TaskDAO', () => {
  let dao: TaskDAO;
  const dbPath = ':memory:'; // Use in-memory database for testing

  beforeEach(() => {
    dao = new TaskDAO(dbPath);
  });

  afterEach(() => {
    dao.close();
  });

  it('should initialize the database', () => {
    // Check if the table exists after initialization
    const tableExists = dao.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'").get();
    expect(tableExists).toBeTruthy();
  });

  it('should add a task', () => {
    const task = dao.addTask('Test Task');
    expect(task).toMatchObject({ title: 'Test Task', completed: false });
    expect(task.id).toBeGreaterThan(0);
  });


  it('should get all tasks', async () => {
    dao.addTask('Task 1');
    await delay(10);
    dao.addTask('Task 2');
    const tasks = dao.getAllTasks();
    expect(tasks.length).toBe(2);
    expect(tasks[0].title).toBe('Task 2'); // Order by created_at DESC
    expect(tasks[1].title).toBe('Task 1');
  });

  it('should update a task', () => {
    const task = dao.addTask('Original Title');
    const updated = dao.updateTask({ ...task, title: 'Updated Title', completed: true, tags: ['updated'] });
    expect(updated).toBe(true);
    const retrievedTask = dao.findTaskById(task.id);
    expect(retrievedTask).toMatchObject({ id: task.id, title: 'Updated Title', completed: true, tags: ['updated'] });
  });

  it('should mark a task as completed', () => {
    const task = dao.addTask('Test Task');
    const result = dao.markTaskCompleted(task.id);
    expect(result).toBe(true);
    const updatedTask = dao.findTaskById(task.id);
    expect(updatedTask?.completed).toBe(true);
  });


  it('should delete a task', () => {
    const task = dao.addTask('Test Task');
    const result = dao.deleteTask(task.id);
    expect(result).toBe(true);
    const deletedTask = dao.findTaskById(task.id);
    expect(deletedTask).toBeNull();
  });

  it('should find a task by ID', () => {
    const task = dao.addTask('Test Task');
    const foundTask = dao.findTaskById(task.id);
    expect(foundTask).toMatchObject(task);
  });

  it('should find tasks by title', () => {
    dao.addTask('Task 1');
    dao.addTask('Task 2');
    dao.addTask('Other Task');
    const tasks = dao.findTasksByTitle('Task');
    expect(tasks.length).toBe(3);
  });

  it('should add and remove a tag', () => {
    const task = dao.addTask('Test Task');
    let success = dao.addTag(task.id, 'tag1');
    expect(success).toBe(true);
    success = dao.addTag(task.id, 'tag2');
    expect(success).toBe(true);

    let updatedTask = dao.findTaskById(task.id);
    expect(updatedTask?.tags).toEqual(['tag1', 'tag2']);

    success = dao.removeTag(task.id, 'tag1');
    expect(success).toBe(true);

    updatedTask = dao.findTaskById(task.id);
    expect(updatedTask?.tags).toEqual(['tag2']);
  });

  it('should find tasks by tag', () => {
    dao.addTask('Task 1');
    const task2 = dao.addTask('Task 2');
    dao.addTag(task2.id, 'testTag');
    const tasks = dao.findTasksByTag('testTag');
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Task 2');
  });

  it('should handle null tags correctly', () => {
    const task = dao.addTask('Task without tags');
    expect(task.tags).toBeNull();
    const success = dao.removeTag(task.id, 'nonExistentTag'); // Try removing a tag from a task with no tags
    expect(success).toBe(false);
  });


  it('should handle date and timestamps', async () => {
    const task = dao.addTask('Task with timestamps');
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeInstanceOf(Date);

    const retrievedTaskBeforeUpdate = dao.findTaskById(task.id);
    expect(retrievedTaskBeforeUpdate?.createdAt).toBeInstanceOf(Date);
    expect(retrievedTaskBeforeUpdate?.updatedAt).toBeInstanceOf(Date);
    if(retrievedTaskBeforeUpdate) { // type guard
        expect(retrievedTaskBeforeUpdate.createdAt.getTime()).toBe(retrievedTaskBeforeUpdate.updatedAt.getTime());
    }

    await delay(1000);
    const updated = dao.updateTask({ ...task, title: 'Updated Title' });
    expect(updated).toBeTruthy();

    const retrievedTaskAfterUpdate = dao.findTaskById(task.id);
    if(retrievedTaskAfterUpdate && retrievedTaskBeforeUpdate) { // type guard
        expect(retrievedTaskAfterUpdate.updatedAt.getTime()).toBeGreaterThan(retrievedTaskBeforeUpdate.updatedAt.getTime());
    }
  });


});