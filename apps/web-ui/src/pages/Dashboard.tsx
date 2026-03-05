export const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      <h1>Dashboard</h1>
      <p className="text-slate-400">You are signed in.</p>
      <button
        className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
        onClick={() => {
          window.localStorage.removeItem("code");
          window.location.href =
            "http://localhost:4000/auth/logout?redirectTo=http://localhost:3000";
        }}
      >
        Sign out
      </button>
    </div>
  );
};
