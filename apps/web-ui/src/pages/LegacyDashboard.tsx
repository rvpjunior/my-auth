import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/LegacyAuthContext";
import { useEffect, useState } from "react";

export default function LegacyDashboard() {
  const { authenticated, logout, loading } = useAuth();
  const [tasks, setTasks] = useState<string[]>([]);

  console.log({ authenticated, loading });

  useEffect(() => {
    if (authenticated) {
      const fetchTasks = async () => {
        const response = await fetch("http://localhost:4000/tasks", {
          credentials: "include",
        });
        if (!response.ok) {
          logout();
          return;
        }
        const data = await response.json();
        setTasks(data.tasks);
      };
      fetchTasks();
    }
  }, [authenticated, logout]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading...</p>
      </div>
    );

  if (!authenticated) return <Navigate to="/legacy/login" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      <h1 className="text-3xl font-semibold text-white mb-2">Legacy Dashboard!</h1>
      <p className="text-slate-400 mb-6">You are signed in.</p>
      <ul className="list-disc list-inside mb-6">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task} className="text-slate-300 text-white">
              {task}
            </li>
          ))
        ) : (
          <li className="text-slate-400 text-white">No tasks found</li>
        )}
      </ul>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => logout()}
          className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
