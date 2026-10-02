export function Loading() {
  return (
    <div className="loading">
      <span className="spinner" /> Loading your workspace…
    </div>
  );
}
export function ErrorBox({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">!</span>
      <b>We couldn’t load this page</b>
      <p>{message}</p>
      {retry && (
        <button className="button secondary" onClick={retry}>
          Try again
        </button>
      )}
    </div>
  );
}
export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">⌁</span>
      <b>{title}</b>
      <p>{text}</p>
    </div>
  );
}
import "./../styles/components.css";
