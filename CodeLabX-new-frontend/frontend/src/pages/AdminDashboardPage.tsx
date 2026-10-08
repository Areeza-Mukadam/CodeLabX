import { useAuth } from "../state/authStore";
import "../styles/pages/dashboards.css";

export function AdminDashboardPage() {
  const user = useAuth((state) => state.user);

  return (
    <section className="admin-overview">
      <span className="eyebrow">ADMIN CONSOLE</span>
      <div className="welcome-row">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="muted">Your administrator account is signed in.</p>
        </div>
      </div>
      <div className="admin-notice" role="status">
        <b>Administrator access is active</b>
        <span>
          This account has a separate role and sign-in boundary. Administration
          tools can be added here as the platform grows.
        </span>
      </div>
      <div className="card" style={{ maxWidth: 560, marginTop: 24 }}>
        <span className="eyebrow">ACCOUNT</span>
        <h2>{user?.name}</h2>
        <p className="muted">{user?.email}</p>
        <span className="status-pill">Administrator</span>
      </div>
    </section>
  );
}
