import { Link, Outlet, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import { Brand } from "./Brand";
import "./../styles/pages/app-shell.css";

export function AppShell() {
  const user = useAuth((s) => s.user),
    clear = useAuth((s) => s.clear),
    nav = useNavigate();
  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {}
    clear();
    nav("/login");
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {user?.role === "STUDENT" ? (
            <>
              <Link to="/" className="nav-link">
                <span>▦</span> My practicals
              </Link>
              <Link to="/" className="nav-link">
                <span>◷</span> Recent activity
              </Link>
            </>
          ) : user?.role === "ADMIN" ? (
            <Link to="/admin" className="nav-link">
              <span>⚙</span> Administration
            </Link>
          ) : (
            <>
              <Link to="/teacher" className="nav-link">
                <span>▦</span> Overview
              </Link>
              <Link to="/teacher/practicals/new" className="nav-link">
                <span>＋</span> Practicals
              </Link>
              <Link to="/teacher/submissions" className="nav-link">
                <span>✓</span> Submissions
              </Link>
            </>
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-chip">
            <span className="avatar">
              {user?.name
                ?.split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2) || "CL"}
            </span>
            <div>
              <b>{user?.name}</b>
              <small>
                {user?.role === "TEACHER"
                  ? "Teacher"
                  : user?.role === "ADMIN"
                    ? "Administrator"
                    : "Student"}
              </small>
            </div>
            <button className="icon-button" title="Sign out" onClick={logout}>
              ↗
            </button>
          </div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="crumb">
            CodeLabX <span>/</span>{" "}
            <b>
              {user?.role === "TEACHER"
                ? "Faculty portal"
                : user?.role === "ADMIN"
                  ? "Admin console"
                  : "Student portal"}
            </b>
          </div>
          <div className="topbar-right">
            <span className="connection-dot" /> Lab environment{" "}
            <span className="avatar tiny">{user?.name?.[0]}</span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
