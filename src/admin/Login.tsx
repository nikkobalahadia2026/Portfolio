import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { signIn } from "../lib/auth";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { Button, Input, Label } from "./ui";

export default function Login() {
  const { session, loading: sessionLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!sessionLoading && session) {
    return <Navigate to="/admin/profile" replace />;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-surface-dark px-4">
        <div className="card p-8 max-w-md text-center">
          <h1 className="font-display text-lg font-semibold">Supabase isn't connected yet</h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-neutral-400">
            Add <code className="chip">VITE_SUPABASE_URL</code> and{" "}
            <code className="chip">VITE_SUPABASE_ANON_KEY</code> to a <code>.env</code> file, run the
            SQL in <code>supabase/schema.sql</code>, and create an admin user in your Supabase
            project's Authentication tab. See the README for the full walkthrough.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-surface-dark px-4">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-sm">
        <div className="h-10 w-10 rounded-xl bg-maroon-800 flex items-center justify-center text-white mb-4">
          <Lock size={18} />
        </div>
        <h1 className="font-display text-lg font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-neutral-400">
          Sign in to edit your portfolio content.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
