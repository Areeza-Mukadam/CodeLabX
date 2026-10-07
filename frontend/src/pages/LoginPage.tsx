import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import tcetLogo from "../assets/tcet-mumbai-logo.png";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import type { User } from "../types";
import "../styles/pages/login.css";

type LoginRole = "student" | "faculty" | "admin";

const roleDetails: Record<
  LoginRole,
  {
    tab: string;
    eyebrow: string;
    title: string;
    email: string;
  }
> = {
  student: {
    tab: "Student",
    eyebrow: "STUDENT PORTAL",
    title: "Your next practical starts here.",
    email: "student@tcetmumbai.in",
  },
  faculty: {
    tab: "Faculty",
    eyebrow: "FACULTY PORTAL",
    title: "Prepare the lab. Guide the work.",
    email: "teacher@tcetmumbai.in",
  },
  admin: {
    tab: "Admin",
    eyebrow: "ADMIN CONSOLE",
    title: "Manage your CodeLabX workspace.",
    email: "admin@tcetmumbai.in",
  },
};

export function LoginPage() {
  const [role, setRole] = useState<LoginRole>("student");
  const [email, setEmail] = useState(roleDetails.student.email);
  const [password, setPassword] = useState("CodeLabX123!");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const setAuth = useAuth((state) => state.setAuth);
  const nav = useNavigate();
  const details = roleDetails[role];

  function chooseRole(nextRole: LoginRole) {
    setRole(nextRole);
    setEmail(roleDetails[nextRole].email);
    setPassword("CodeLabX123!");
    setError("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const expectedRole =
        role === "faculty" ? "TEACHER" : role === "admin" ? "ADMIN" : "STUDENT";
      if (result.user.role !== expectedRole) {
        const selected = role === "faculty" ? "faculty / teacher" : role;
        throw new Error(
          `This account does not have the selected ${selected} role. Choose its matching sign-in type.`,
        );
      }
      setAuth(result.token, result.user);
      nav(
        result.user.role === "ADMIN"
          ? "/admin"
          : result.user.role === "STUDENT"
            ? "/semester-selection"
            : "/",
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={`login-page role-${role}`}>
      <img
        className="tcet-logo login-logo"
        src={tcetLogo}
        alt="Thakur College of Engineering and Technology"
      />
      <section className="login-brand">
        <div className="login-copy">
          <span className="eyebrow">{details.eyebrow}</span>
          <h1>{details.title}</h1>
          <div className="login-benefits">
            {role === "student" && (
              <>
              </>
            )}
            {role === "faculty" && (
              <>
              </>
            )}
            {role === "admin" && (
              <>
              </>
            )}
          </div>
        </div>
        <span className="login-foot">CODELABX · ACADEMIC LABORATORY</span>
      </section>

      <section className="login-panel">
        <div
          className="login-role-switch"
          role="tablist"
          aria-label="Choose sign-in type"
        >
          {(Object.keys(roleDetails) as LoginRole[]).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={role === option}
              className={role === option ? "selected" : ""}
              onClick={() => chooseRole(option)}
            >
              {roleDetails[option].tab}
            </button>
          ))}
        </div>

        <form className="login-form" onSubmit={submit}>
          <span className="eyebrow">{details.eyebrow}</span>
          <h2>
            {role === "admin"
              ? "Administrator sign in"
              : "Sign in to your account"}
          </h2>
          <p className="muted">
            {role === "student"
              ? "Use your college student account to continue."
              : role === "faculty"
                ? "Use your faculty account to manage your laboratory."
                : "Use an institution administrator account."}
          </p>

          {role === "admin" && (
            <div className="admin-notice" role="status">
              <b>Administrative access</b>
              <span>
                Administrator accounts are provisioned separately from student
                and faculty accounts.
              </span>
            </div>
          )}

          <label>
            {role === "student"
              ? "Student email"
              : role === "faculty"
                ? "Faculty email"
                : "Administrator email"}
            <input
              required
              type="email"
              autoComplete="username"
              placeholder={
                role === "admin" ? "admin@tcetmumbai.in" : "name@college.edu"
              }
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <div className="alert">{error}</div>}
          <button className="button primary full" disabled={busy}>
            {busy
              ? "Signing in…"
              : role === "admin"
                ? "Continue to admin console"
                : role === "faculty"
                  ? "Continue to faculty console"
                  : "Continue to student console"}
            <span>→</span>
          </button>

          <div className="demo-box">
            <b>
              Demo{" "}
              {role === "student"
                ? "student"
                : role === "faculty"
                  ? "faculty"
                  : "admin"}{" "}
              account
            </b>
            <span>{email}</span>
            {role === "student" && <span>student2@tcetmumbai.in</span>}
            <small>Password: CodeLabX123!</small>
          </div>
        </form>
      </section>
    </main>
  );
}
