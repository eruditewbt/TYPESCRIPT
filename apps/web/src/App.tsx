import { useEffect, useState } from "react";
import type { AuthSuccess, User } from "@ts-academy/types";

const API_URL = "http://localhost:3000";
const TOKEN_KEY = "ts_academy_token";

type Mode = "login" | "register";

export function App() {
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("Create an account to enter the starter dashboard.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    void loadCurrentUser(token);
  }, [token]);

  async function loadCurrentUser(activeToken: string) {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Unable to load your account.");
      }

      const currentUser = (await response.json()) as User;
      setUser(currentUser);
      setMessage(`Welcome back, ${currentUser.email}.`);
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Unable to load your account.";
      setMessage(nextMessage);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(mode === "register" ? "Creating your account..." : "Signing you in...");

    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const payload = (await response.json()) as AuthSuccess | { message?: string };
      if (!response.ok || !("token" in payload)) {
        const errorMessage = "message" in payload ? payload.message : undefined;
        throw new Error(errorMessage ?? "Authentication failed.");
      }

      setToken(payload.token);
      localStorage.setItem(TOKEN_KEY, payload.token);
      setUser(payload.user);
      setPassword("");
      setMessage(`Signed in as ${payload.user.email}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    setMessage("You are signed out.");
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">TypeScript Academy</p>
        <h1>Ship your first full-stack TypeScript system.</h1>
        <p className="lede">
          This vertical slice proves the academy is a real product: CLI, API, web app, and a working
          authentication flow.
        </p>
      </section>

      <section className="card">
        {user ? (
          <div className="dashboard">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h2>{user.email}</h2>
              <p className="muted">You are authenticated against the academy starter API.</p>
            </div>
            <div className="dashboard-grid">
              <article>
                <h3>Next Task</h3>
                <p>Implement organizations and role-based access as the next contribution slice.</p>
              </article>
              <article>
                <h3>API Status</h3>
                <p>Connected to `GET /me` with a bearer token from local storage.</p>
              </article>
            </div>
            <button className="secondary" onClick={handleLogout} type="button">
              Log out
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="mode-switch">
              <button
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
                type="button"
              >
                Register
              </button>
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
                type="button"
              >
                Login
              </button>
            </div>
            <label>
              Email
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@tsacademy.dev"
                type="email"
                value={email}
              />
            </label>
            <label>
              Password
              <input
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Make it memorable"
                type="password"
                value={password}
              />
            </label>
            <button disabled={loading} type="submit">
              {loading ? "Working..." : mode === "register" ? "Create Account" : "Log In"}
            </button>
          </form>
        )}

        <p className="message">{message}</p>
      </section>
    </main>
  );
}
