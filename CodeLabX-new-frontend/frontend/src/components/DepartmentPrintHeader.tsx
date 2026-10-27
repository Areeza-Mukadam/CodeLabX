import { useEffect, useState } from "react";
import computerHeader from "../assets/tcet-comp-header.png";
import itHeader from "../assets/tcet-it-header.png";

function departmentSlug(department: string): string {
  const value = department.toLowerCase();
  if (value.includes("information technology") || value === "it") return "information-technology";
  if (value.includes("computer science") && value.includes("iot")) return "computer-science-engineering-iot";
  if (value.includes("electronics") && value.includes("telecommunication")) return "electronics-telecommunication";
  if (value.includes("electronics") && value.includes("computer")) return "electronics-computer-science";
  if (value.includes("data science") || value.includes("ai&ds")) return "artificial-intelligence-data-science";
  if (value.includes("machine learning") || value.includes("aiml")) return "artificial-intelligence-machine-learning";
  if (value.includes("computer") || value.includes("comp")) return "computer-engineering";
  return value.trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "engineering";
}

export function DepartmentPrintHeader({ department }: { department?: string | null }) {
  const name = department?.trim() || "Engineering";
  const slug = departmentSlug(name);
  const existingHeader = slug === "computer-engineering" ? computerHeader
    : slug === "information-technology" ? itHeader
      : `/department-headers/${slug}.png`;
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [existingHeader]);

  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      {!failed ? (
        <img
          key={existingHeader}
          src={existingHeader}
          alt={`Department of ${name} - TCET`}
          onError={() => setFailed(true)}
          style={{ width: "100%", maxHeight: 95, objectFit: "contain", display: "block" }}
        />
      ) : (
        <div style={{ borderBottom: "2px solid #b91c1c", paddingBottom: 14 }}>
          <b style={{ color: "#991b1b" }}>THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY</b>
          <div style={{ fontSize: 13, fontWeight: 700 }}>DEPARTMENT OF {name.toUpperCase()}</div>
        </div>
      )}
    </div>
  );
}
