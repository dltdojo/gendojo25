import {dao} from "@/app/todo/dao";
import { TaskTable } from "@/app/todo/forms";

export default function Home() {
  const tasks = dao.getAllTasks()
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
    <h1 className="text-3xl font-semibold">Debug DB</h1>
    <textarea
        className="w-full max-w-2xl h-96 border rounded p-2 font-mono text-sm"
        value={JSON.stringify(tasks, null, 2)} // Display tasks as formatted JSON
        readOnly // Make the textarea read-only
      />
    <h1 className="text-3xl font-semibold">shadcn ui table</h1>
    <TaskTable tasks={tasks} /> {/* Pass tasks to the TaskList component */}
  </main>
  );
}