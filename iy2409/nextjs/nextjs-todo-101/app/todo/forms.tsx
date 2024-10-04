// This is a next.js "use client" file, which means this component will only be rendered on the client-side
"use client";

// Import actions to perform CRUD (Create, Read, Update, Delete) operations on tasks
import { createTask, deleteTask, findTask, completeTask } from "@/app/todo/actions"; // Create a new task, delete a task by id, find a task by content

// Import the useFormState hook from react-dom to get the current state, action, and isPending status
import { useFormState } from 'react-dom';

/**
 * TaskForm component: allows users to create a new task
 */
export function TaskForm() {
  // Get the current state, action, and isPending status using the useFormState hook
  // The first argument is the action creator (createTask), the second argument is the initial state (null)
  const [error, todoAction, isPending] = useFormState(createTask, null);
  
  // Render the task form with an input field for the task title and a button to add the task
  return (
    <div>
      <h1 className="text-3xl font-semibold">Add Task</h1>
      <form action={todoAction} className="flex flex-col gap-y-2">
        <input 
          // Type of input field: text
          type="text" 
          // Name attribute for form submission
          name="title" 
          // Placeholder text for the input field
          placeholder="go to work" 
          // Styles for the input field
          className="py-2 px-3 border rounded"
        />
        <button 
          // Background color and text color for the button
          className="bg-blue-500 text-white py-2 px-3 rounded-sm"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}

/**
 * FindTaskForm component: allows users to find a task by content
 */
export function FindTaskForm() {
  // Get the current state, action, and isPending status using the useFormState hook
  // The first argument is the action creator (findTask), the second argument is the initial state (null)
  const [state, action, isPending] = useFormState(findTask, null);
  
  // Render the find task form with an input field for the task content and a button to find the task
  return (
    <div>
      <h1 className="text-3xl font-semibold">Find Task</h1>
      <form action={action} className="flex flex-col gap-y-2">
        <input 
          // Type of input field: text
          type="text" 
          // Name attribute for form submission
          name="content" 
          // Placeholder text for the input field
          placeholder="work" 
          // Styles for the input field
          className="py-2 px-3 border rounded"
        />
        <button 
          // Background color and text color for the button
          className="bg-blue-500 text-white py-2 px-3 rounded-sm"
        >
          Find Task
        </button>
      </form>
      {/* Display the found tasks in an unordered list */}
      {state && 
        <ul>
          {state.map((task) => (
            <li 
              // Key for each list item
              className="py-1" 
              key={task.id}
            >
              {task.id}: {task.title}
            </li>
          ))}
        </ul>
      }
      {/* Display a message if no tasks are found */}
      {state && state.length == 0 && <span>Not Found</span>}
    </div>
  );
}

/**
 * DeleteBtn component: deletes a task by id when clicked
 * @param {object} props - component props
 * @param {number} props.id - id of the task to delete
 */
export function DeleteBtn({ id }) {
  // Render a button to delete a task
  return (
    <button 
      // Background color and text color for the button
      onClick={async () => {
        // Call the deleteTask action creator to delete the task by id
        await deleteTask(id);
      }} 
      className="bg-red-500 text-white py-1 px-1 rounded-sm"
    >
      DEL
    </button>
  );
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} className="py-1 flex items-center justify-between">
          <span className={task.completed ? "line-through" : ""}>
            {task.id}: {task.title}
          </span>
          <div className="flex gap-x-2">
            <button
              onClick={async () => {
                await completeTask(task.id);
              }}
              className="bg-green-500 text-white py-1 px-1 rounded-sm"
              disabled={task.completed} // Disable if already completed
            >
              Done
            </button>
            <DeleteBtn id={task.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}