import dao from "@/app/todo/dao";
import { TaskForm, DeleteBtn, FindTaskForm, TaskList } from "@/app/todo/forms";

export default function Home() {
  const tasks = dao.getTasks()
  console.log(tasks)
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
    <h1 className="text-3xl font-semibold">My Todos</h1>
    <TaskList tasks={tasks} /> {/* Pass tasks to the TaskList component */}
    <TaskForm />
    <FindTaskForm/>
  </main>
  );
}