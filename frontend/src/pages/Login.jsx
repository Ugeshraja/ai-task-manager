import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">Welcome back</h1>
        <p className="text-ink/60 text-sm mb-8">Sign in to see what's worth doing today.</p>

        {error && (
          <div className="mb-4 rounded-md bg-clay/10 text-clay text-sm px-3 py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-mist rounded-md px-4 py-2.5 bg-white focus:ring-2 focus:ring-sage outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-mist rounded-md px-4 py-2.5 bg-white focus:ring-2 focus:ring-sage outline-none"
          />
          <button
            type="submit"
            className="w-full bg-ink text-paper rounded-md py-2.5 font-medium hover:bg-sage transition-colors"
          >
            Sign in
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-6">
          No account?{" "}
          <Link to="/register" className="text-clay font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
