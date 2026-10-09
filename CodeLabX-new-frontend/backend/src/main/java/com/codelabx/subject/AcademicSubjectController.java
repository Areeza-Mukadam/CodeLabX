package com.codelabx.subject;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/subjects", "/subjects"})
public class AcademicSubjectController {

    private final AcademicSubjectRepository subjects;

    public AcademicSubjectController(AcademicSubjectRepository subjects) {
        this.subjects = subjects;
    }

    @GetMapping
    public List<SubjectView> bySemester(@RequestParam(required = false) Integer semester) {
        List<AcademicSubject> list = semester != null
                ? subjects.findBySemesterOrderByNameAsc(semester)
                : subjects.findAll(org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Order.asc("semester"),
                        org.springframework.data.domain.Sort.Order.asc("name")
                  ));

        return list.stream()
                .map(subject -> new SubjectView(subject.getCode(), subject.getName(), subject.getSemester()))
                .toList();
    }

    public record SubjectView(String code, String name, Integer semester) { }
}
