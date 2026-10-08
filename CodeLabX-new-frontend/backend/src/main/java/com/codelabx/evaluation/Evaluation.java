package com.codelabx.evaluation;

import com.codelabx.submission.Submission;
import com.codelabx.user.UserAccount;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", unique = true)
    private Submission submission;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private UserAccount teacher;

    private Integer codeMarks;
    private Integer vivaMarks;
    private Integer totalMarks;

    @Column(length = 8000)
    private String feedback;

    private Instant evaluatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission submission) { this.submission = submission; }
    public UserAccount getTeacher() { return teacher; }
    public void setTeacher(UserAccount teacher) { this.teacher = teacher; }
    public Integer getCodeMarks() { return codeMarks; }
    public void setCodeMarks(Integer codeMarks) { this.codeMarks = codeMarks; }
    public Integer getVivaMarks() { return vivaMarks; }
    public void setVivaMarks(Integer vivaMarks) { this.vivaMarks = vivaMarks; }
    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public Instant getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(Instant evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
