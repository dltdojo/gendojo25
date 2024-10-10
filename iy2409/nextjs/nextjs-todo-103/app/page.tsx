import {dao} from "@/app/todo/dao";
import { TaskForm, FindTaskForm, TaskList, FindTasksByTagForm } from "@/app/todo/forms";
import Link  from "next/link";

export default function Home() {
  const tasks = dao.getAllTasks()
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
    <h1 className="text-3xl font-semibold">My Todos</h1>
    <TaskList tasks={tasks} /> {/* Pass tasks to the TaskList component */}
    <TaskForm />
    <FindTaskForm/>
    <FindTasksByTagForm/>
    <Link href="/debug-db" className="bg-red-500 p-2 rounded">Debug DB</Link>
  </main>
  );
}