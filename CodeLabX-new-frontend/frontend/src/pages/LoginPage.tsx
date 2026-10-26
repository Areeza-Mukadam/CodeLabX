import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import tcetLogo from "../assets/tcet-mumbai-logo.png";
import { api } from "../services/api";
import { DEMO_PASSWORD, DEMO_USERS } from "../services/mockData";
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

const DEPARTMENT_LIST = [
  "Computer Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Artificial Intelligence & Machine Learning",
  "Computer Science & Engineering (IoT)",
  "Electronics & Computer Science",
  "Electronics & Telecommunication",
];

function createDemoSession(
  cleanEmail: string,
  expectedRole: "STUDENT" | "TEACHER" | "ADMIN",
): { token: string; user: User } | null {
  const demoUser = DEMO_USERS[cleanEmail];
  if (demoUser) {
    return {
      token: `demo-token-${demoUser.role.toLowerCase()}-${demoUser.id}-${Date.now()}`,
      user: demoUser,
    };
  }
  if (cleanEmail.endsWith("@tcetmumbai.in")) {
    const user: User = {
      id: Math.floor(Math.random() * 8000) + 100,
      name: cleanEmail.split("@")[0].replace(/[._-]/g, " "),
      email: cleanEmail,
      role: expectedRole,
      classSection: "SE-B",
      division: "B",
      cohort: "SE",
      department: "Computer Engineering",
    };
    return {
      token: `demo-token-${user.role.toLowerCase()}-${user.id}-${Date.now()}`,
      user,
    };
  }
  return null;
}

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<LoginRole>("student");
  const [email, setEmail] = useState(roleDetails.student.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Sign up fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [regDepartment, setRegDepartment] = useState("Computer Engineering");
  const [regYear, setRegYear] = useState("SE");
  const [regDivision, setRegDivision] = useState("B");
  const [regRollNo, setRegRollNo] = useState("");

  const setAuth = useAuth((state) => state.setAuth);
  const nav = useNavigate();
  const details = roleDetails[role];

  function chooseRole(nextRole: LoginRole) {
    setRole(nextRole);
    setEmail(roleDetails[nextRole].email);
    setPassword("");
    setError("");
  }

  async function performLogin(targetEmail: string, targetPass: string) {
    setBusy(true);
    setError("");

    const cleanEmail = targetEmail.trim().toLowerCase();
    if (!cleanEmail.endsWith("@tcetmumbai.in")) {
      setError("Only @tcetmumbai.in college email addresses are permitted.");
      setBusy(false);
      return;
    }

    const expectedRole =
      role === "faculty" ? "TEACHER" : role === "admin" ? "ADMIN" : "STUDENT";

    try {
      let token = "";
      let user: User | null = null;

      try {
        const result = await api<{ token: string; user: User }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: cleanEmail, password: targetPass }),
        });
        token = result.token;
        user = result.user;
      } catch (backendError) {
        if (targetPass === DEMO_PASSWORD) {
          const session = createDemoSession(cleanEmail, expectedRole);
          if (session) {
            token = session.token;
            user = session.user;
          } else {
            throw backendError;
          }
        } else {
          throw backendError;
        }
      }

      if (!user) {
        throw new Error("Unable to authenticate with provided credentials");
      }

      if (user.role !== expectedRole) {
        const selected = role === "faculty" ? "faculty / teacher" : role;
        throw new Error(
          `This account has role ${user.role}, not the selected ${selected} portal. Switch to the matching sign-in tab.`,
        );
      }

      setAuth(token, user);
      nav(
        user.role === "ADMIN"
          ? "/admin"
          : user.role === "STUDENT"
            ? "/semester-selection"
            : "/",
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  function submitLogin(event: FormEvent) {
    event.preventDefault();
    performLogin(email, password);
  }

  async function submitRegister(event: FormEvent) {
    event.preventDefault();
    setError("");

    const cleanEmail = regEmail.trim().toLowerCase();
    if (!cleanEmail.endsWith("@tcetmumbai.in")) {
      setError("Registration requires a valid @tcetmumbai.in college email address.");
      return;
    }

    if (!regName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const classSec = `${regYear}-${regDivision}`;
      const payload = {
        name: regName.trim(),
        email: cleanEmail,
        password: regPassword,
        role: regRole,
        department: regDepartment,
        classSection: regRole === "STUDENT" ? classSec : null,
        division: regRole === "STUDENT" ? regDivision : null,
        rollNo: regRole === "STUDENT" ? regRollNo.trim() : null,
      };

      const result = await api<{ token: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setAuth(result.token, result.user);
      nav(
        result.user.role === "STUDENT"
          ? "/semester-selection"
          : result.user.role === "ADMIN"
            ? "/admin"
            : "/",
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to create account. Please try again.",
      );
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
              <p className="login-tagline">
                Sign in or register using your college email address (@tcetmumbai.in).
                Select your department and access semester syllabus experiments.
              </p>
            )}
            {role === "faculty" && (
              <p className="login-tagline">
                Upload practical documents (PDF / DOC) or author custom
                experiments to assign to your division classes.
              </p>
            )}
            {role === "admin" && (
              <p className="login-tagline">
                Oversee academic rosters, student divisions, and department
                practicals.
              </p>
            )}
          </div>
        </div>
        <span className="login-foot">
          CODELABX · THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY
        </span>
      </section>

      <section className="login-panel">
        <div className="auth-mode-toggle" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button
            type="button"
            className={`auth-toggle-btn ${!isSignUp ? "active" : ""}`}
            onClick={() => {
              setIsSignUp(false);
              setError("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              border: !isSignUp ? "2px solid var(--palette-red, #c02040)" : "1px solid #cbd5e1",
              background: !isSignUp ? "#fff" : "transparent",
              color: !isSignUp ? "var(--palette-red, #c02040)" : "var(--muted, #64748b)",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${isSignUp ? "active" : ""}`}
            onClick={() => {
              setIsSignUp(true);
              setError("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              border: isSignUp ? "2px solid var(--palette-red, #c02040)" : "1px solid #cbd5e1",
              background: isSignUp ? "#fff" : "transparent",
              color: isSignUp ? "var(--palette-red, #c02040)" : "var(--muted, #64748b)",
            }}
          >
            ＋ Create Account (Sign Up)
          </button>
        </div>

        {!isSignUp ? (
          <>
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

            <form className="login-form" onSubmit={submitLogin}>
              <span className="eyebrow">{details.eyebrow}</span>
              <h2>
                {role === "admin"
                  ? "Administrator sign in"
                  : role === "faculty"
                    ? "Faculty sign in"
                    : "Student college sign in"}
              </h2>
              <p className="muted">
                {role === "student"
                  ? "Use your college email ID (@tcetmumbai.in) to access your practicals."
                  : role === "faculty"
                    ? "Use your faculty account (@tcetmumbai.in) to manage laboratory work."
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
                  ? "Student college email (@tcetmumbai.in)"
                  : role === "faculty"
                    ? "Faculty email (@tcetmumbai.in)"
                    : "Administrator email"}
                <input
                  required
                  type="email"
                  autoComplete="username"
                  placeholder="name.year.div@tcetmumbai.in"
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
                      : "Continue to student workspace"}
                <span>→</span>
              </button>

            </form>
          </>
        ) : (
          /* CREATE ACCOUNT (SIGN UP) FORM */
          <form className="login-form" onSubmit={submitRegister}>
            <span className="eyebrow">NEW USER REGISTRATION</span>
            <h2>Create your TCET account</h2>
            <p className="muted">
              Registration is restricted to verified <b>@tcetmumbai.in</b> college email addresses.
            </p>

            <label>
              Account Type / Role
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as "STUDENT" | "TEACHER")}
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Faculty / Teacher</option>
              </select>
            </label>

            <label>
              Full Name
              <input
                required
                type="text"
                placeholder="e.g. Inzamam Khan"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </label>

            <label>
              College Email (@tcetmumbai.in only)
              <input
                required
                type="email"
                placeholder="name.year.div@tcetmumbai.in"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </label>

            <label>
              Engineering Department
              <select
                value={regDepartment}
                onChange={(e) => setRegDepartment(e.target.value)}
              >
                {DEPARTMENT_LIST.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </label>

            {regRole === "STUDENT" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <label>
                  Year
                  <select value={regYear} onChange={(e) => setRegYear(e.target.value)}>
                    <option value="FE">First Year (FE)</option>
                    <option value="SE">Second Year (SE)</option>
                    <option value="TE">Third Year (TE)</option>
                    <option value="BE">Final Year (BE)</option>
                  </select>
                </label>
                <label>
                  Division
                  <select value={regDivision} onChange={(e) => setRegDivision(e.target.value)}>
                    <option value="A">Div A</option>
                    <option value="B">Div B</option>
                    <option value="C">Div C</option>
                    <option value="D">Div D</option>
                  </select>
                </label>
                <label>
                  Roll No
                  <input
                    type="text"
                    placeholder="e.g. 13"
                    value={regRollNo}
                    onChange={(e) => setRegRollNo(e.target.value)}
                  />
                </label>
              </div>
            )}

            <label>
              Password (Min 6 characters)
              <input
                required
                type="password"
                placeholder="Create a strong password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </label>

            <label>
              Confirm Password
              <input
                required
                type="password"
                placeholder="Confirm your password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
              />
            </label>

            {error && <div className="alert">{error}</div>}

            <button className="button primary full" disabled={busy}>
              {busy ? "Creating account…" : "Create Account & Continue"}
              <span>→</span>
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
