import { NewTaskForm, TaskList, TaskTableWithTabs } from "@/app/todos/todo-ui";
import { dao } from "@/app/todos/todo-dao";

export default function Page() {
  const tasks = dao.getAllTasks()
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
      <NewTaskForm/>
    <TaskList tasks={tasks} />
    <h1>Task table with tabs</h1>
    <TaskTableWithTabs tasks={tasks}/>
  </main>
  );
}
