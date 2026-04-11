import { getUser } from "../utils/localStorage";

export const Dashboard = () => {
  const user = getUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      <h1 className="text-slate-300 text-2xl font-bold">Welcome {user?.name}!</h1>
      <p className="text-slate-400">You are signed in.</p>
      <button
        className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
        onClick={() => {
          window.localStorage.removeItem("auth_tokens");
          window.location.href =
            "http://localhost:4000/auth/logout?redirectTo=http://localhost:3000";
        }}
      >
        Sign out
      </button>
    </div>
  );
};
