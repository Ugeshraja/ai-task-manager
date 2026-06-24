import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-mist">
      
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="AI Task Manager"
          className="w-10 h-10 rounded-xl shadow-sm"
        />

        <div className="flex flex-col">
          <span className="font-display text-2xl font-semibold text-ink">
            Focus
          </span>
          <span className="text-xs uppercase tracking-widest text-sage">
            AI Task Manager
          </span>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink/70">
            Hi, {user.name}
          </span>

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