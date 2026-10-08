package com.codelabx.subject;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class AcademicSubjectController {

    private final AcademicSubjectRepository subjects;

    public AcademicSubjectController(AcademicSubjectRepository subjects) {
        this.subjects = subjects;
    }

    @GetMapping
    public List<SubjectView> bySemester(@RequestParam Integer semester) {
        return subjects.findBySemesterOrderByNameAsc(semester).stream()
                .map(subject -> new SubjectView(subject.getCode(), subject.getName(), subject.getSemester()))
                .toList();
    }

    public record SubjectView(String code, String name, Integer semester) { }
}
