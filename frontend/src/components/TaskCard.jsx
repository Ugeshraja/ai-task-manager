import api from "../api/axios";

const PRIORITY_STYLES = {
  low: "bg-mist text-ink/70",
  medium: "bg-sage/20 text-sage",
  high: "bg-clay/20 text-clay",
  urgent: "bg-clay text-white",
};

export default function TaskCard({ task, onUpdated, onDeleted }) {
  const toggleSubtask = async (subId) => {
    const updatedSubtasks = task.subtasks.map((s) =>
      s._id === subId ? { ...s, completed: !s.completed } : s
    );
    const { data } = await api.put(`/tasks/${task._id}`, { subtasks: updatedSubtasks });
    onUpdated(data);
  };

  const cycleStatus = async () => {
    const order = ["todo", "in-progress", "done"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    const { data } = await api.put(`/tasks/${task._id}`, { status: next });
    onUpdated(data);
  };

  const handleDelete = async () => {
    await api.delete(`/tasks/${task._id}`);
    onDeleted(task._id);
  };

  return (
    <div className="bg-white border border-mist rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className={`font-medium text-ink ${task.status === "done" ? "line-through text-ink/40" : ""}`}>
            {task.title}
          </h3>
          {task.description && <p className="text-sm text-ink/60 mt-0.5">{task.description}</p>}
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.aiPriorityReason && (
        <p className="text-xs text-sage italic">✨ {task.aiPriorityReason}</p>
      )}

      {task.subtasks?.length > 0 && (
        <ul className="space-y-1 pt-1">
          {task.subtasks.map((s) => (
            <li key={s._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.completed}
                onChange={() => toggleSubtask(s._id)}
                className="accent-sage"
              />
              <span className={s.completed ? "line-through text-ink/40" : "text-ink/80"}>
                {s.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={cycleStatus}
          className="text-xs font-medium px-2.5 py-1 rounded-md border border-mist hover:border-sage hover:text-sage capitalize"
        >
          {task.status.replace("-", " ")} → click to advance
        </button>
        <button onClick={handleDelete} className="text-xs text-ink/40 hover:text-clay">
          Delete
        </button>
      </div>
    </div>
  );
}
