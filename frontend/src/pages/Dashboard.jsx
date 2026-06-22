import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import AISuggestions from "../components/AISuggestions";

const FILTERS = ["all", "todo", "in-progress", "done"];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (task) => setTasks((prev) => [task, ...prev]);
  const handleTaskUpdated = (updated) =>
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  const handleTaskDeleted = (id) => setTasks((prev) => prev.filter((t) => t._id !== id));

  const visibleTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TaskForm onTaskCreated={handleTaskCreated} />

          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border capitalize ${
                  filter === f
                    ? "bg-ink text-paper border-ink"
                    : "border-mist text-ink/60 hover:border-sage"
                }`}
              >
                {f.replace("-", " ")}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-ink/50 text-sm">Loading tasks…</p>
          ) : visibleTasks.length === 0 ? (
            <p className="text-ink/50 text-sm">No tasks here yet. Add one above.</p>
          ) : (
            <div className="space-y-3">
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdated={handleTaskUpdated}
                  onDeleted={handleTaskDeleted}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <AISuggestions tasks={tasks} />
        </div>
      </main>
    </div>
  );
}
