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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
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

    @GetMapping("/api/teacher/dashboard")
    public DashboardView dashboard() {
        long active = practicals.findByStatusOrderByCreatedAtDesc(PracticalStatus.PUBLISHED).size();
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
        var recent = practicals.findAllByOrderByUpdatedAtDesc().stream().limit(8).map(p -> new RecentPractical(
                p.getId(),
                p.getTitle(),
                p.getStatus().name(),
                assignments.countByPracticalId(p.getId()),
                progress.countByPracticalIdAndStatus(p.getId(), ProgressStatus.SUBMITTED)
                        + progress.countByPracticalIdAndStatus(p.getId(), ProgressStatus.EVALUATED)
        )).toList();
        return new DashboardView(active, studentCount, pendingEval, vivaPending, recent);
    }

    public record RecentPractical(Long id, String title, String status, long students, long completed) {}
    public record DashboardView(long activePracticals, long students, long pendingEvaluations, long vivaPending, java.util.List<RecentPractical> recentPracticals) {}
}
