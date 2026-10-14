interface SemesterSelectionProps {
  onSelect?: (semester: number) => void;
  departmentName?: string;
  departmentCode?: string;
  onChangeDepartment?: () => void;
}

const years = [
  { year: 1, semesters: [1, 2] },
  { year: 2, semesters: [3, 4] },
  { year: 3, semesters: [5, 6] },
  { year: 4, semesters: [7, 8] },
];

export default function SemesterSelection({
  onSelect,
  departmentName,
  departmentCode,
  onChangeDepartment,
}: SemesterSelectionProps) {
  return (
    <div className="wsr-stage">
      {departmentName && (
        <div className="dept-banner-bar">
          <button
            type="button"
            className="semester-change-link"
            onClick={onChangeDepartment}
          >
            ← Change Department
          </button>
          <div className="dept-badge-pill">
            <span className="dept-dot" />
            <b>{departmentName}</b>
            {departmentCode && <span className="dept-tag">{departmentCode}</span>}
          </div>
        </div>
      )}

      <div className="wsr-head">
        <span className="wsr-tag">ACADEMIC YEAR · 2026–27</span>
        <h2>Select Your Semester</h2>
        <p>
          {departmentName
            ? `Choose the academic semester for ${departmentName} to access syllabus experiments.`
            : "Choose your academic year and select the semester you want to access."}
        </p>
      </div>

      <div className="wsr-grid">
        {years.map((year, index) => (
          <div
            key={year.year}
            className="wsr-card wow animate__animated animate__fadeInUp"
            data-wow-delay={`${index * 0.15}s`}
          >
            <div className="wsr-icon">0{year.year}</div>

            <h3>
              {year.year}
              {["st", "nd", "rd", "th"][year.year - 1]} Year
            </h3>

            <div className="semester-options">
              {year.semesters.map((semester) => (
                <button
                  key={semester}
                  type="button"
                  className="semester-option"
                  onClick={() => onSelect?.(semester)}
                >
                  <span className="semester-type">
                    {semester % 2 === 1 ? "ODD" : "EVEN"}
                  </span>

                  <span className="semester-title">Semester {semester}</span>

                  <span className="semester-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
