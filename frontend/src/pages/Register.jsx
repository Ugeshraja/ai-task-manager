import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">Create your account</h1>
        <p className="text-ink/60 text-sm mb-8">Let the AI help you sort what matters.</p>

        {error && (
          <div className="mb-4 rounded-md bg-clay/10 text-clay text-sm px-3 py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-mist rounded-md px-4 py-2.5 bg-white focus:ring-2 focus:ring-sage outline-none"
          />
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-mist rounded-md px-4 py-2.5 bg-white focus:ring-2 focus:ring-sage outline-none"
          />
          <button
            type="submit"
            className="w-full bg-ink text-paper rounded-md py-2.5 font-medium hover:bg-sage transition-colors"
          >
            Create account
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-clay font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
