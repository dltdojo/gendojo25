import {dao} from "@/app/todo/dao";
import { TaskForm, FindTaskForm, TaskList, FindTasksByTagForm } from "@/app/todo/forms";

export default function Home() {
  const tasks = dao.getTasks()
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
    <h1 className="text-3xl font-semibold">My Todos</h1>
    <TaskList tasks={tasks} /> {/* Pass tasks to the TaskList component */}
    <TaskForm />
    <FindTaskForm/>
    <FindTasksByTagForm/>
  </main>
  );
}