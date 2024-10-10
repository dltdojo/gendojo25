import { dao } from "@/app/todos/todo-dao";
import { redirect } from "next/navigation";
import { UpdateTaskForm } from "../todo-ui";
export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    if (params.slug) {
        const taskId = parseInt(params.slug);
        const task = dao.findTaskById(taskId);
        if (task) {
            return (<main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
                <h1>{task.title}</h1>
                <UpdateTaskForm task={task} />
                {searchParams.debug && (
                    <div>
                        <h1 className="text-3xl font-semibold">Debug JSON</h1>
                        <textarea
                            className="w-full max-w-2xl h-96 border rounded p-2 font-mono text-sm"
                            value={JSON.stringify(task, null, 2)} // Display tasks as formatted JSON
                            readOnly // Make the textarea read-only
                        />
                    </div>
                )}
            </main>)
        }
    }
    redirect("/")
}