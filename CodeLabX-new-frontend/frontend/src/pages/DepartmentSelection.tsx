import { DEPARTMENTS, type DepartmentInfo } from "../services/curriculumData";
import "../styles/pages/semester-selection.css";

interface DepartmentSelectionProps {
  onSelect: (dept: DepartmentInfo) => void;
  selectedId?: string;
}

export default function DepartmentSelection({
  onSelect,
  selectedId,
}: DepartmentSelectionProps) {
  return (
    <div className="wsr-stage">
      <div className="wsr-head">
        <span className="wsr-tag">THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY</span>
        <h2>Select Your Department</h2>
        <p>
          Choose your branch to access academic curriculum, semester laboratories, and experiments.
        </p>
      </div>

      <div className="department-grid">
        {DEPARTMENTS.map((dept) => {
          const isSelected = selectedId === dept.id;
          return (
            <div
              key={dept.id}
              className={`department-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(dept)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(dept);
                }
              }}
            >
              <div className="department-card-top">
                <span className="department-icon">{dept.icon}</span>
                <span className="department-code">{dept.code}</span>
              </div>
              <h3 className="department-name">{dept.name}</h3>
              <p className="department-tagline">{dept.tagline}</p>
              <div className="department-action">
                <span>Select Department</span>
                <span className="department-arrow">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
