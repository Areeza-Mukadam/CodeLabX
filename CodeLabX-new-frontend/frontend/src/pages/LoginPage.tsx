import { useMemo, useState } from "react";
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

const studentPresets = [
  {
    label: "Areeza Mukadam (SE-B)",
    email: "student@tcetmumbai.in",
    division: "SE-B",
  },
  {
    label: "Rahul Verma (SE-B)",
    email: "rahul.verma.se.b@tcetmumbai.in",
    division: "SE-B",
  },
  {
    label: "Tanvi Patil (SE-B)",
    email: "tanvi.patil.se.b@tcetmumbai.in",
    division: "SE-B",
  },
  {
    label: "Aarav Mehta (SE-A)",
    email: "aarav.mehta.se.a@tcetmumbai.in",
    division: "SE-A",
  },
  {
    label: "Sagar Mishra (TE-A)",
    email: "student2@tcetmumbai.in",
    division: "TE-A",
  },
  {
    label: "Sneha Deshmukh (TE-A)",
    email: "sneha.deshmukh.te.a@tcetmumbai.in",
    division: "TE-A",
  },
];

const facultyPresets = [
  {
    label: "Prof. Samir Sawant (CMPN)",
    email: "teacher@tcetmumbai.in",
    division: "CMPN",
  },
  {
    label: "Prof. Rashmi Thakur (IT)",
    email: "faculty.it@tcetmumbai.in",
    division: "IT",
  },
  {
    label: "Prof. Rajesh Patel (AIML)",
    email: "faculty.aiml@tcetmumbai.in",
    division: "AIML",
  },
];

const adminPresets = [
  {
    label: "CodeLabX Administrator",
    email: "admin@tcetmumbai.in",
    division: "Admin",
  },
  {
    label: "TCET Exam Cell Admin",
    email: "admin.exam@tcetmumbai.in",
    division: "Exam Cell",
  },
];

function parseEmailPreview(emailStr: string) {
  if (!emailStr || !emailStr.includes("@")) return null;
  const user = emailStr.split("@")[0].toLowerCase();
  let cohort = "SE";
  let yearName = "Second Year (SE)";
  if (user.includes("fe") || user.includes("25")) {
    cohort = "FE";
    yearName = "First Year (FE)";
  } else if (user.includes("te") || user.includes("23")) {
    cohort = "TE";
    yearName = "Third Year (TE)";
  } else if (user.includes("be") || user.includes("22")) {
    cohort = "BE";
    yearName = "Final Year (BE)";
  }

  let division = "B";
  const divMatch = user.match(
    /(?:^|[._-])(?:div[._-]?)?([a-d])(?=[._-\d]|$)|(?:fe|se|te|be)[._-]?([a-d])/i,
  );
  if (divMatch) {
    division = (divMatch[1] || divMatch[2]).toUpperCase();
  }

  let name = "";
  if (user === "student") name = "Areeza Mukadam";
  else if (user === "student2") name = "Sagar Mishra";
  else {
    const tokens = user
      .split(/[._-]+/)
      .filter(
        (t) =>
          ![
            "fe",
            "se",
            "te",
            "be",
            "comp",
            "cmpn",
            "it",
            "aiml",
            "aids",
            "extc",
            "mech",
            "div",
            "student",
            "tcet",
          ].includes(t) && !/\d/.test(t),
      );
    if (tokens.length > 0) {
      name = tokens
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(" ");
    } else {
      name = `Student (${cohort}-${division})`;
    }
  }

  return {
    name,
    classSection: `${cohort}-${division}`,
    division,
    cohort,
    yearName,
    department: user.includes("it")
      ? "Information Technology"
      : "Computer Engineering",
  };
}

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
    const preview = parseEmailPreview(cleanEmail);
    const user: User = {
      id: Math.floor(Math.random() * 8000) + 100,
      name: preview?.name || "Demo User",
      email: cleanEmail,
      role: expectedRole,
      classSection: preview?.classSection || "SE-B",
      division: preview?.division || "B",
      cohort: preview?.cohort || "SE",
      department: preview?.department || "Computer Engineering",
    };
    return {
      token: `demo-token-${user.role.toLowerCase()}-${user.id}-${Date.now()}`,
      user,
    };
  }
  return null;
}

export function LoginPage() {
  const [role, setRole] = useState<LoginRole>("student");
  const [email, setEmail] = useState(roleDetails.student.email);
  const [password, setPassword] = useState("CodeLabX123!");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const setAuth = useAuth((state) => state.setAuth);
  const nav = useNavigate();
  const details = roleDetails[role];

  const studentPreview = useMemo(() => {
    if (role !== "student") return null;
    return parseEmailPreview(email);
  }, [role, email]);

  function chooseRole(nextRole: LoginRole) {
    setRole(nextRole);
    setEmail(roleDetails[nextRole].email);
    setPassword("CodeLabX123!");
    setError("");
  }

  async function performLogin(targetEmail: string, targetPass: string) {
    setBusy(true);
    setError("");
    const expectedRole =
      role === "faculty" ? "TEACHER" : role === "admin" ? "ADMIN" : "STUDENT";

    try {
      let token = "";
      let user: User | null = null;

      try {
        const result = await api<{ token: string; user: User }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: targetEmail, password: targetPass }),
        });
        token = result.token;
        user = result.user;
      } catch (backendError) {
        // Fallback to demo account resolution if backend is unreachable or account is local demo
        const cleanEmail = targetEmail.trim().toLowerCase();
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

  function submit(event: FormEvent) {
    event.preventDefault();
    performLogin(email, password);
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
                Sign in using your college email address. Your division,
                academic year, and respected class are automatically mapped.
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
              : role === "faculty"
                ? "Faculty sign in"
                : "Student college sign in"}
          </h2>
          <p className="muted">
            {role === "student"
              ? "Use your college email ID (@tcetmumbai.in) to automatically identify your class & division."
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
              ? "Student college email"
              : role === "faculty"
                ? "Faculty email"
                : "Administrator email"}
            <input
              required
              type="email"
              autoComplete="username"
              placeholder={
                role === "admin"
                  ? "admin@tcetmumbai.in"
                  : "name.year.div@tcetmumbai.in"
              }
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          {role === "student" && studentPreview && (
            <div
              className="email-preview-card"
              role="status"
              aria-live="polite"
            >
              <div className="email-preview-top">
                <span className="badge-pulse" />
                <b>Detected student:</b>
                <span>{studentPreview.name}</span>
              </div>
              <div className="email-preview-grid">
                <div>
                  <small>CLASS</small>
                  <strong>{studentPreview.classSection}</strong>
                </div>
                <div>
                  <small>DIVISION</small>
                  <strong>Div {studentPreview.division}</strong>
                </div>
                <div>
                  <small>YEAR</small>
                  <strong>{studentPreview.yearName}</strong>
                </div>
                <div>
                  <small>BRANCH</small>
                  <strong>{studentPreview.department}</strong>
                </div>
              </div>
            </div>
          )}

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

          {role === "student" && (
            <div className="demo-box">
              <div className="demo-box-header">
                <b>Select a student demo account:</b>
                <span className="demo-pass-badge">Pass: CodeLabX123!</span>
              </div>
              <div className="preset-chip-list">
                {studentPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.email}
                    className={`preset-chip ${email === preset.email ? "active" : ""}`}
                    onClick={() => {
                      setEmail(preset.email);
                      setPassword("CodeLabX123!");
                      performLogin(preset.email, "CodeLabX123!");
                    }}
                  >
                    <span>{preset.label}</span>
                    <small>{preset.division}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {role === "faculty" && (
            <div className="demo-box">
              <div className="demo-box-header">
                <b>Select a faculty demo account:</b>
                <span className="demo-pass-badge">Pass: CodeLabX123!</span>
              </div>
              <div className="preset-chip-list">
                {facultyPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.email}
                    className={`preset-chip ${email === preset.email ? "active" : ""}`}
                    onClick={() => {
                      setEmail(preset.email);
                      setPassword("CodeLabX123!");
                      performLogin(preset.email, "CodeLabX123!");
                    }}
                  >
                    <span>{preset.label}</span>
                    <small>{preset.division}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {role === "admin" && (
            <div className="demo-box">
              <div className="demo-box-header">
                <b>Select an administrator demo account:</b>
                <span className="demo-pass-badge">Pass: CodeLabX123!</span>
              </div>
              <div className="preset-chip-list">
                {adminPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.email}
                    className={`preset-chip ${email === preset.email ? "active" : ""}`}
                    onClick={() => {
                      setEmail(preset.email);
                      setPassword("CodeLabX123!");
                      performLogin(preset.email, "CodeLabX123!");
                    }}
                  >
                    <span>{preset.label}</span>
                    <small>{preset.division}</small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
