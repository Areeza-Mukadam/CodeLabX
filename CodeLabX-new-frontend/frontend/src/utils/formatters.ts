export function humanStatus(x: string) {
  return x === "SUBMITTED"
    ? "Submitted"
    : x === "EVALUATED"
      ? "Evaluated"
      : x === "PUBLISHED"
        ? "Published"
        : x === "DRAFT"
          ? "Draft"
          : x === "NOT_STARTED"
            ? "Not started"
            : "In progress";
}
export function statusClass(x: string) {
  return x === "SUBMITTED" || x === "EVALUATED"
    ? "done"
    : x === "DRAFT"
      ? "draft"
      : "active";
}
export function date(x: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(new Date(x));
  } catch {
    return "recently";
  }
}
