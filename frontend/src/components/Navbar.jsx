import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-mist">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-semibold text-ink">Focus</span>
        <span className="text-xs uppercase tracking-widest text-sage">AI Task Manager</span>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink/70">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-clay hover:underline"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
