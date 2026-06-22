import { useState } from "react";
import api from "../api/axios";

export default function AISuggestions({ tasks }) {
  const [summary, setSummary] = useState("");
  const [orderedIds, setOrderedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePrioritize = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/prioritize", {});
      setSummary(data.summary);
      setOrderedIds(data.orderedTaskIds || []);
    } catch (err) {
      console.error(err);
      alert("Could not get AI prioritization.");
    } finally {
      setLoading(false);
    }
  };

  const orderedTasks = orderedIds
    .map((id) => tasks.find((t) => t._id === id))
    .filter(Boolean);

  return (
    <div className="bg-ink text-paper rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold">Today's focus</h2>
        <button
          onClick={handlePrioritize}
          disabled={loading || tasks.length === 0}
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-paper text-ink hover:bg-sage hover:text-white disabled:opacity-40"
        >
          {loading ? "Thinking…" : "✨ Refresh with AI"}
        </button>
      </div>

      {summary ? (
        <p className="text-sm text-paper/80 mb-3">{summary}</p>
      ) : (
        <p className="text-sm text-paper/50 mb-3">
          Click "Refresh with AI" to get a ranked focus order for your open tasks.
        </p>
      )}

      {orderedTasks.length > 0 && (
        <ol className="space-y-1.5 list-decimal list-inside">
          {orderedTasks.map((t) => (
            <li key={t._id} className="text-sm text-paper/90">
              {t.title}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
