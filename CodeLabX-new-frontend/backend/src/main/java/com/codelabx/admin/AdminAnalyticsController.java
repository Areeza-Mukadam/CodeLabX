package com.codelabx.admin;

import com.codelabx.evaluation.EvaluationRepository;
import com.codelabx.practical.PracticalAssignment;
import com.codelabx.practical.PracticalAssignmentRepository;
import com.codelabx.practical.PracticalRepository;
import com.codelabx.practical.Practical;
import com.codelabx.submission.Submission;
import com.codelabx.submission.SubmissionRepository;
import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/admin/analytics", "/admin/analytics"})
public class AdminAnalyticsController {
    private final UserRepository users;
    private final PracticalRepository practicals;
    private final PracticalAssignmentRepository assignments;
    private final SubmissionRepository submissions;
    private final EvaluationRepository evaluations;

    public AdminAnalyticsController(UserRepository users, PracticalRepository practicals, PracticalAssignmentRepository assignments, SubmissionRepository submissions, EvaluationRepository evaluations) {
        this.users = users; this.practicals = practicals; this.assignments = assignments; this.submissions = submissions; this.evaluations = evaluations;
    }

    @GetMapping({"", "/"})
    @Transactional(readOnly = true)
    public Analytics dashboard(@RequestParam(required = false) String department, @RequestParam(required = false) String year,
            @RequestParam(required = false) String division, @RequestParam(required = false) String subject,
            @RequestParam(required = false) Long facultyId, @RequestParam(required = false) Long practicalId,
            @RequestParam(required = false) String from, @RequestParam(required = false) String to) {
        Instant fromInstant = null;
        if (from != null && !from.isBlank()) {
            try { fromInstant = Instant.parse(from); } catch (Exception ignored) {}
        }
        Instant toInstant = null;
        if (to != null && !to.isBlank()) {
            try { toInstant = Instant.parse(to); } catch (Exception ignored) {}
        }
        final Instant finalFrom = fromInstant;
        final Instant finalTo = toInstant;

        List<UserAccount> allUsers = users.findAll();
        List<UserAccount> students = allUsers.stream().filter(u -> u.getRole() == Role.STUDENT && match(department,u.getDepartment()) && match(year,u.getCohort()) && match(division,u.getDivision())).toList();
        Set<Long> studentIds = students.stream().map(UserAccount::getId).collect(Collectors.toSet());
        List<Submission> filtered = submissions.findAllByOrderBySubmittedAtDesc().stream()
                .filter(s -> s.getStudent() != null && studentIds.contains(s.getStudent().getId()))
                .filter(s -> s.getPractical() != null && match(subject, s.getPractical().getSubject()))
                .filter(s -> practicalId == null || (s.getPractical() != null && s.getPractical().getId().equals(practicalId)))
                .filter(s -> facultyId == null || (s.getPractical() != null && s.getPractical().getCreatedBy() != null && s.getPractical().getCreatedBy().getId().equals(facultyId)))
                .filter(s -> finalFrom == null || (s.getSubmittedAt() != null && !s.getSubmittedAt().isBefore(finalFrom)))
                .filter(s -> finalTo == null || (s.getSubmittedAt() != null && !s.getSubmittedAt().isAfter(finalTo))).toList();
        Map<String,Long> byDepartment = filtered.stream().collect(Collectors.groupingBy(s -> value(s.getStudent() != null ? s.getStudent().getDepartment() : null), TreeMap::new, Collectors.counting()));
        Map<String,Long> byClass = filtered.stream().collect(Collectors.groupingBy(s -> value(s.getStudent() != null ? s.getStudent().getDepartment() : null)+" · "+(s.getStudent() != null ? className(s.getStudent()) : "Unassigned"), TreeMap::new, Collectors.counting()));
        List<PracticalAssignment> filteredAssignments = assignments.findAll().stream()
                .filter(a -> a.getPractical() != null && a.getPractical().getCreatedBy() != null)
                .filter(a -> match(department, a.getStudent() == null ? assignmentDepartment(a) : a.getStudent().getDepartment()))
                .filter(a -> match(year, sectionYear(a)))
                .filter(a -> match(division, sectionDivision(a)))
                .filter(a -> match(subject, a.getPractical() != null ? a.getPractical().getSubject() : null))
                .filter(a -> facultyId == null || (a.getPractical() != null && a.getPractical().getCreatedBy() != null && a.getPractical().getCreatedBy().getId().equals(facultyId)))
                .filter(a -> practicalId == null || (a.getPractical() != null && a.getPractical().getId().equals(practicalId)))
                .filter(a -> finalFrom == null || (a.getAssignedAt() != null && !a.getAssignedAt().isBefore(finalFrom)))
                .filter(a -> finalTo == null || (a.getAssignedAt() != null && !a.getAssignedAt().isAfter(finalTo))).toList();
        Map<String,List<PracticalAssignment>> assignmentGroups=filteredAssignments.stream().collect(Collectors.groupingBy(this::assignmentKey,TreeMap::new,Collectors.toList()));
        List<AssignmentMetric> assignmentMetrics=assignmentGroups.values().stream().map(this::metric).toList();
        List<Practical> filteredPracticals=practicals.findAll().stream().filter(p->match(subject,p.getSubject()))
                .filter(p->facultyId==null||(p.getCreatedBy() != null && p.getCreatedBy().getId().equals(facultyId))).filter(p->practicalId==null||p.getId().equals(practicalId)).toList();
        Set<String> departments = students.stream().map(UserAccount::getDepartment).filter(Objects::nonNull).collect(Collectors.toSet());
        Set<String> classes = students.stream().map(u -> value(u.getDepartment())+" · "+className(u)).filter(s -> !s.endsWith("Unassigned")).collect(Collectors.toSet());
        List<UserAccount> facultyRows=allUsers.stream().filter(u->u.getRole()==Role.TEACHER&&match(department,u.getDepartment())).toList();
        long pending = filtered.stream().filter(s -> evaluations.findBySubmissionId(s.getId()).isEmpty()).count();
        return new Analytics(departments.size(), classes.size(), students.size(), facultyRows.size(),
                filteredPracticals.size(), assignmentMetrics.size(), filtered.size(), pending,
                byDepartment.entrySet().stream().map(e -> new Bucket(e.getKey(),e.getValue())).toList(),
                byClass.entrySet().stream().map(e -> new Bucket(e.getKey(),e.getValue())).toList(), assignmentMetrics,
                departments.stream().sorted().toList(), students.stream().map(UserAccount::getCohort).filter(Objects::nonNull).distinct().sorted().toList(),
                students.stream().map(UserAccount::getDivision).filter(Objects::nonNull).distinct().sorted().toList(),
                facultyRows.stream().map(u -> new Option(u.getId(),u.getName())).toList(),
                filteredPracticals.stream().map(p -> new Option(p.getId(),p.getTitle())).toList(),
                filteredPracticals.stream().map(p -> p.getSubject()).filter(Objects::nonNull).distinct().sorted().toList());
    }

    private AssignmentMetric metric(List<PracticalAssignment> rows) {
        if (rows.isEmpty()) return new AssignmentMetric("Unknown", null, null, "Practical", 0, 0, 0, 0);
        PracticalAssignment a=rows.getFirst();
        boolean wholeClass=rows.stream().anyMatch(r->r.getClassSection()!=null);
        List<UserAccount> target = wholeClass ? users.findByRole(Role.STUDENT).stream().filter(u -> Objects.equals(a.getClassSection(), className(u))&&(a.getClassDepartment()==null||Objects.equals(a.getClassDepartment(),u.getDepartment()))).toList()
                : rows.stream().map(PracticalAssignment::getStudent).filter(Objects::nonNull).collect(Collectors.toMap(UserAccount::getId,u->u,(x,y)->x)).values().stream().toList();
        List<Submission> sent = (a.getPractical() != null) ? submissions.findByPracticalIdOrderBySubmittedAtDesc(a.getPractical().getId()).stream().filter(s -> target.stream().anyMatch(u -> u.getId().equals(s.getStudent().getId()))).toList() : List.of();
        long reviewed = sent.stream().filter(s -> evaluations.findBySubmissionId(s.getId()).isPresent()).count();
        String facultyName = (a.getPractical() != null && a.getPractical().getCreatedBy() != null) ? a.getPractical().getCreatedBy().getName() : "Faculty";
        String practicalTitle = a.getPractical() != null ? a.getPractical().getTitle() : "Practical";
        return new AssignmentMetric(facultyName, wholeClass?a.getClassDepartment():a.getStudent()==null?null:a.getStudent().getDepartment(), a.getClassSection()!=null?a.getClassSection():className(a.getStudent()), practicalTitle, target.size(), sent.size(), sent.size()-reviewed, reviewed);
    }
    private String assignmentKey(PracticalAssignment a){return a.getPractical().getId()+"|"+(a.getClassSection()!=null?value(a.getClassDepartment())+"|"+a.getClassSection():a.getStudent()==null?"unassigned":value(a.getStudent().getDepartment())+"|"+className(a.getStudent()));}
    private static String className(UserAccount u) { return u.getCohort()==null||u.getDivision()==null?"Unassigned":u.getCohort()+"-"+u.getDivision(); }
    private static String sectionYear(PracticalAssignment a) { return a.getStudent()!=null?a.getStudent().getCohort():a.getClassSection()==null?null:a.getClassSection().split("-")[0]; }
    private static String sectionDivision(PracticalAssignment a) { return a.getStudent()!=null?a.getStudent().getDivision():a.getClassSection()==null?null:a.getClassSection().split("-").length>1?a.getClassSection().split("-")[1]:null; }
    private String assignmentDepartment(PracticalAssignment a){return a.getClassDepartment()!=null?a.getClassDepartment():users.findByRole(Role.STUDENT).stream().filter(u->Objects.equals(className(u),a.getClassSection())).map(UserAccount::getDepartment).filter(Objects::nonNull).findFirst().orElse(null);}
    private static String value(String v) { return v==null||v.isBlank()?"Unassigned":v; }
    private static boolean match(String filter,String actual) { return filter==null||filter.isBlank()||Objects.equals(filter,actual); }
    public record Bucket(String label,long submissions) {}
    public record Option(Long id,String name) {}
    public record AssignmentMetric(String faculty,String department,String classSection,String practical,int students,int submissions,long pending,long reviewed) {}
    public record Analytics(long totalDepartments,long totalClasses,long totalStudents,long totalFaculty,long totalPracticals,long totalAssignments,long totalSubmissions,long pendingReviews,List<Bucket> departmentSubmissions,List<Bucket> classSubmissions,List<AssignmentMetric> facultyAssignments,List<String> departments,List<String> years,List<String> divisions,List<Option> faculty,List<Option> practicals,List<String> subjects) {}
}
