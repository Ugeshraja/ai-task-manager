import { useState } from "react";
import api from "../api/axios";

const PRIORITY_STYLES = {
  low: "bg-mist text-ink/70",
  medium: "bg-sage/20 text-sage",
  high: "bg-clay/20 text-clay",
  urgent: "bg-clay text-white",
};

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!title.trim()) return;
    setAnalyzing(true);
    setAiResult(null);
    try {
      const { data } = await api.post("/ai/analyze", { title, description, dueDate });
      setAiResult(data);
    } catch (err) {
      console.error(err);
      alert("AI analysis failed. Check your ANTHROPIC_API_KEY on the server.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        dueDate: dueDate || undefined,
        priority: aiResult?.priority || "medium",
        aiPriorityReason: aiResult?.reason || "",
        subtasks: (aiResult?.subtasks || []).map((s) => ({ title: s, completed: false })),
      };
      const { data } = await api.post("/tasks", payload);
      onTaskCreated(data);
      setTitle("");
      setDescription("");
      setDueDate("");
      setAiResult(null);
    } catch (err) {
      console.error(err);
      alert("Could not create task.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-mist rounded-xl p-5 space-y-3">
      <h2 className="font-display text-lg font-semibold text-ink">New task</h2>
      <input
        type="text"
        placeholder="What needs to get done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border border-mist rounded-md px-3 py-2 focus:ring-2 focus:ring-sage outline-none"
      />
      <textarea
        placeholder="Add detail (optional) — the more context, the better the AI breakdown"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full border border-mist rounded-md px-3 py-2 focus:ring-2 focus:ring-sage outline-none"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border border-mist rounded-md px-3 py-2 focus:ring-2 focus:ring-sage outline-none"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={analyzing || !title.trim()}
          className="text-sm font-medium px-3 py-2 rounded-md border border-sage text-sage hover:bg-sage/10 disabled:opacity-50"
        >
          {analyzing ? "Analyzing…" : "✨ Ask AI to prioritize & break down"}
        </button>
        <button
          type="submit"
          disabled={saving}
          className="text-sm font-medium px-4 py-2 rounded-md bg-ink text-paper hover:bg-sage disabled:opacity-50"
        >
          {saving ? "Saving…" : "Add task"}
        </button>
      </div>

      {aiResult && (
        <div className="mt-2 border border-mist rounded-md p-3 bg-paper">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wide text-ink/50">AI suggestion</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[aiResult.priority]}`}>
              {aiResult.priority}
            </span>
          </div>
          <p className="text-sm text-ink/70 mb-2">{aiResult.reason}</p>
          {aiResult.subtasks?.length > 0 && (
            <ul className="text-sm text-ink/80 list-disc list-inside space-y-0.5">
              {aiResult.subtasks.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
