// This is a next.js "use client" file, which means this component will only be rendered on the client-side
"use client";

// Import actions to perform CRUD (Create, Read, Update, Delete) operations on tasks
import { createTask, deleteTask, findTask, completeTask, removeTagFromTask, findTasksByTagName, addTagToTask } from "@/app/todo/actions"; // Create a new task, delete a task by id, find a task by content

// Import the useFormState hook from react-dom to get the current state, action, and isPending status
import { useFormState } from 'react-dom';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dao, Task } from "@/app/todo/dao";

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

export function TagList({ taskId, tags }: { taskId: number, tags: string[] | null }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex gap-x-2 flex-wrap">
      {tags.map((tag) => (
        <span 
          key={tag} 
          className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-x-1"
        >
          {tag}
          <button
            onClick={() => removeTagFromTask(taskId, tag)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}

export function TaskTable({ tasks }: { tasks: Task[] }) {
   // Calculate total number of tasks for the footer.
   const totalTasks = tasks.length;

   // Calculate total number of completed tasks.
   const completedTasks = tasks.filter(task => task.completed).length;
   return (
     <Table>
       <TableCaption>A list of your tasks.</TableCaption>
       <TableHeader>
         <TableRow>
           <TableHead>ID</TableHead>
           <TableHead>Title</TableHead>
           <TableHead>Completed</TableHead>
           <TableHead>Tags</TableHead>
           <TableHead>Created At</TableHead>
           <TableHead>Updated At</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         {tasks.map((task) => (
           <TableRow key={task.id}>
             <TableCell className="font-medium">{task.id}</TableCell>
             <TableCell>{task.title}</TableCell>
             <TableCell>{task.completed ? "Yes" : "No"}</TableCell>
             <TableCell>
               <TagList taskId={task.id} tags={task.tags}/> {/* Display tags */}
               </TableCell>
             <TableCell>{task.createdAt.toLocaleString()}</TableCell>
             <TableCell>{task.updatedAt.toLocaleString()}</TableCell>
           </TableRow>
         ))}
       </TableBody>
       <TableFooter>
         <TableRow>
           <TableCell colSpan={3}>Total Tasks: {totalTasks}</TableCell>
           <TableCell colSpan={3} >Completed Tasks:{completedTasks} </TableCell>
         </TableRow>
       </TableFooter>
     </Table>
   );
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul className="w-full max-w-2xl">
      {tasks.map((task) => (
        <li key={task.id} className="py-2 border-b">
          <div className="flex items-center justify-between">
            <span className={task.completed ? "line-through" : ""}>
              {task.id}: {task.title}
            </span>
            <div className="flex gap-x-2">
              <button
                onClick={async () => {
                  await completeTask(task.id);
                }}
                className="bg-green-500 text-white py-1 px-1 rounded-sm"
                disabled={task.completed}
              >
                Done
              </button>
              <DeleteBtn id={task.id} />
            </div>
          </div>
          <div className="mt-2">
            <TagList taskId={task.id} tags={task.tags} />
            <div className="mt-1">
              <TagInput taskId={task.id} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TagInput({ taskId }: { taskId: number }) {
  const bindAction = addTagToTask.bind(null, taskId);
  const [state, action] = useFormState(bindAction, null);
  
  return (
    <form action={action} className="flex gap-x-2">
      <input
        type="text"
        name="tag"
        placeholder="Add tag"
        className="py-1 px-2 border rounded text-sm"
      />
      <button 
        type="submit"
        className="bg-blue-500 text-white py-1 px-2 rounded-sm text-sm"
      >
        Add Tag
      </button>
    </form>
  );
}

export function FindTasksByTagForm() {
  const [state, action] = useFormState(findTasksByTagName, null);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Find Tasks by Tag</h1>
      <form action={action} className="flex flex-col gap-y-2">
        <input 
          type="text" 
          name="tag" 
          placeholder="Enter tag" 
          className="py-2 px-3 border rounded"
        />
        <button 
          className="bg-blue-500 text-white py-2 px-3 rounded-sm"
        >
          Search by Tag
        </button>
      </form>
      {state && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Results:</h2>
          <ul>
            {state.map((task) => (
              <li key={task.id} className="py-1">
                {task.id}: {task.title}
                <TagList taskId={task.id} tags={task.tags} />
              </li>
            ))}
          </ul>
          {state.length === 0 && <p>No tasks found with this tag</p>}
        </div>
      )}
    </div>
  );
}