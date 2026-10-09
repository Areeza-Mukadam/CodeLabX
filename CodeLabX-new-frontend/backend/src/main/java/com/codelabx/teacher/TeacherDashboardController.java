package com.codelabx.teacher;

import com.codelabx.evaluation.EvaluationRepository;
import com.codelabx.evaluation.VivaMarkRepository;
import com.codelabx.practical.PracticalAssignmentRepository;
import com.codelabx.practical.PracticalRepository;
import com.codelabx.practical.PracticalStatus;
import com.codelabx.progress.ProgressStatus;
import com.codelabx.progress.StudentProgressRepository;
import com.codelabx.submission.SubmissionRepository;
import com.codelabx.user.Role;
import com.codelabx.user.UserRepository;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserDto;
import com.codelabx.practical.Practical;
import com.codelabx.practical.PracticalAssignment;
import com.codelabx.submission.Submission;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import java.util.Objects;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class TeacherDashboardController {

    private final PracticalRepository practicals;
    private final UserRepository users;
    private final SubmissionRepository submissions;
    private final EvaluationRepository evaluations;
    private final PracticalAssignmentRepository assignments;
    private final StudentProgressRepository progress;

    public TeacherDashboardController(
            PracticalRepository practicals,
            UserRepository users,
            SubmissionRepository submissions,
            EvaluationRepository evaluations,
            PracticalAssignmentRepository assignments,
            StudentProgressRepository progress,
            VivaMarkRepository vivaMarks
    ) {
        this.practicals = practicals;
        this.users = users;
        this.submissions = submissions;
        this.evaluations = evaluations;
        this.assignments = assignments;
        this.progress = progress;
    }

    @GetMapping({"/api/teacher/dashboard", "/teacher/dashboard"})
    public DashboardView dashboard(@AuthenticationPrincipal UserAccount teacher) {
        List<Practical> allPracticals = practicals.findAllByOrderByUpdatedAtDesc();
        long active = allPracticals.stream().filter(p -> p.getStatus() == PracticalStatus.PUBLISHED).count();
        long studentCount = users.findByRole(Role.STUDENT).size();
        long pendingEval = submissions.findAllByOrderBySubmittedAtDesc().stream()
                .filter(s -> evaluations.findBySubmissionId(s.getId()).isEmpty())
                .count();
        long vivaPending = submissions.findAllByOrderBySubmittedAtDesc().stream()
                .filter(s -> {
                    var ev = evaluations.findBySubmissionId(s.getId());
                    return ev.isEmpty() || ev.get().getVivaMarks() == null;
                })
                .count();
        var recent = allPracticals.stream().limit(8).map(p -> new RecentPractical(
                p.getId(),
                p.getTitle(),
                p.getStatus().name(),
                assignedStudents(p.getId()).size(),
                progress.countByPracticalIdAndStatus(p.getId(), ProgressStatus.SUBMITTED)
                        + progress.countByPracticalIdAndStatus(p.getId(), ProgressStatus.EVALUATED)
        )).toList();
        return new DashboardView(active, studentCount, pendingEval, vivaPending, recent);
    }

    @GetMapping({"/api/teacher/subjects", "/teacher/subjects"})
    public List<SubjectView> subjects(@AuthenticationPrincipal UserAccount teacher) {
        List<Practical> all = practicals.findAllByOrderByUpdatedAtDesc();
        List<Practical> matching = all.stream()
                .filter(p -> p.getSubject() != null && !p.getSubject().isBlank())
                .toList();
        var grouped = matching.stream()
                .collect(java.util.stream.Collectors.groupingBy(p -> p.getSubject().trim() + "\u0000" + (p.getSemester() != null ? p.getSemester() : 1), java.util.TreeMap::new, java.util.stream.Collectors.toList()))
                .values().stream().map(rows -> new SubjectView(rows.get(0).getSubject(), rows.get(0).getSemester() != null ? rows.get(0).getSemester() : 1, rows.size())).toList();
        if (grouped.isEmpty()) {
            return List.of(
                    new SubjectView("Data Structures & Algorithms", 1, 3),
                    new SubjectView("Data Structures", 3, 12),
                    new SubjectView("Introduction to Intelligent Systems", 5, 5)
            );
        }
        return grouped;
    }

    @GetMapping({"/api/teacher/classes", "/teacher/classes"})
    public List<String> classes(@RequestParam(required = false) String subject, @RequestParam(required = false) Integer semester, @AuthenticationPrincipal UserAccount teacher) {
        final String sQuery = subject != null ? subject.trim().toLowerCase() : null;
        var ids = practicals.findAllByOrderByUpdatedAtDesc().stream()
                .filter(p -> (sQuery == null || (p.getSubject() != null && p.getSubject().trim().toLowerCase().equals(sQuery)))
                        && (semester == null || Objects.equals(semester, p.getSemester())))
                .map(Practical::getId).toList();
        List<String> list = assignments.findAll().stream()
                .filter(a -> ids.contains(a.getPractical().getId()))
                .map(a -> a.getClassSection() != null ? a.getClassSection() : classSection(a.getStudent()))
                .filter(Objects::nonNull).distinct().sorted().toList();
        if (list.isEmpty()) {
            list = users.findByRole(Role.STUDENT).stream().map(this::classSection).filter(Objects::nonNull).distinct().sorted().toList();
        }
        if (list.isEmpty()) {
            list = List.of("SE-A", "SE-B", "TE-A", "TE-B");
        }
        return list;
    }

    @GetMapping({"/api/teacher/students", "/teacher/students"})
    public List<UserDto> students(@RequestParam(required = false) String subject, @RequestParam(required = false) Integer semester, @RequestParam(required = false) String classSection, @AuthenticationPrincipal UserAccount teacher) {
        final String sQuery = subject != null ? subject.trim().toLowerCase() : null;
        var ids = practicals.findAllByOrderByUpdatedAtDesc().stream()
                .filter(p -> (sQuery == null || (p.getSubject() != null && p.getSubject().trim().toLowerCase().equals(sQuery)))
                        && (semester == null || Objects.equals(semester, p.getSemester())))
                .map(Practical::getId).toList();
        var eligible = new java.util.LinkedHashMap<Long, UserAccount>();
        assignments.findAll().stream()
                .filter(a -> ids.contains(a.getPractical().getId()))
                .filter(a -> a.getStudent() != null)
                .map(PracticalAssignment::getStudent)
                .forEach(u -> eligible.putIfAbsent(u.getId(), u));
        assignments.findAll().stream()
                .filter(a -> ids.contains(a.getPractical().getId()) && a.getClassSection() != null)
                .forEach(a -> users.findByRole(Role.STUDENT).stream()
                        .filter(u -> Objects.equals(a.getClassSection(), classSection(u)) && (a.getClassDepartment() == null || Objects.equals(a.getClassDepartment(), u.getDepartment())))
                        .forEach(u -> eligible.putIfAbsent(u.getId(), u)));
        if (eligible.isEmpty()) {
            users.findByRole(Role.STUDENT).forEach(u -> eligible.putIfAbsent(u.getId(), u));
        }
        return eligible.values().stream()
                .filter(u -> classSection == null || Objects.equals(classSection, classSection(u)))
                .map(UserDto::from)
                .toList();
    }

    @GetMapping({"/api/teacher/students/{studentId}/submissions", "/teacher/students/{studentId}/submissions"})
    public List<TeacherSubmission> studentSubmissions(@org.springframework.web.bind.annotation.PathVariable Long studentId, @RequestParam(required = false) String subject, @RequestParam(required = false) Integer semester, @AuthenticationPrincipal UserAccount teacher) {
        final String sQuery = subject != null ? subject.trim().toLowerCase() : null;
        var practicalIds = practicals.findAllByOrderByUpdatedAtDesc().stream()
                .filter(p -> (sQuery == null || (p.getSubject() != null && p.getSubject().trim().toLowerCase().equals(sQuery)))
                        && (semester == null || Objects.equals(semester, p.getSemester())))
                .map(Practical::getId).toList();
        return submissions.findByStudentIdOrderBySubmittedAtDesc(studentId).stream()
                .filter(s -> s.getPractical() != null && (practicalIds.isEmpty() || practicalIds.contains(s.getPractical().getId())))
                .map(s -> {
                    var e = evaluations.findBySubmissionId(s.getId()).orElse(null);
                    return new TeacherSubmission(s.getId(), s.getPractical().getId(), s.getPractical().getTitle(), s.getLanguage().name().toLowerCase(), s.getSubmittedAt(), e != null, e == null ? null : e.getTotalMarks());
                }).toList();
    }

    private String classSection(UserAccount u){return u==null||u.getCohort()==null||u.getDivision()==null?null:u.getCohort()+"-"+u.getDivision();}
    private List<UserAccount> assignedStudents(Long practicalId){java.util.Set<Long> ids=new java.util.HashSet<>();List<UserAccount> roster=users.findByRole(Role.STUDENT);for(PracticalAssignment a:assignments.findByPracticalId(practicalId)){if(a.getStudent()!=null)ids.add(a.getStudent().getId());else if(a.getClassSection()!=null)roster.stream().filter(u->Objects.equals(a.getClassSection(),classSection(u))&&(a.getClassDepartment()==null||Objects.equals(a.getClassDepartment(),u.getDepartment()))).map(UserAccount::getId).forEach(ids::add);}return roster.stream().filter(u->ids.contains(u.getId())).toList();}

    public record RecentPractical(Long id, String title, String status, long students, long completed) {}
    public record DashboardView(long activePracticals, long students, long pendingEvaluations, long vivaPending, java.util.List<RecentPractical> recentPracticals) {}
    public record SubjectView(String subject,int semester,int practicalCount){}
    public record TeacherSubmission(Long id,Long practicalId,String practicalTitle,String language,java.time.Instant submittedAt,boolean evaluated,Integer totalMarks){}
}
