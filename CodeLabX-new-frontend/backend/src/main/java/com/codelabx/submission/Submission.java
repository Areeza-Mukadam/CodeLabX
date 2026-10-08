package com.codelabx.submission;

import com.codelabx.execution.CodeLanguage;
import com.codelabx.practical.Practical;
import com.codelabx.user.UserAccount;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private UserAccount student;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "practical_id")
    private Practical practical;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CodeLanguage language;

    @Column(nullable = false, length = 32000)
    private String code;

    @Column(length = 16000)
    private String output;

    @Column(length = 64)
    private String executionStatus;

    @Column(length = 8000)
    private String conclusionText;

    @Column(nullable = false)
    private Instant submittedAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserAccount getStudent() { return student; }
    public void setStudent(UserAccount student) { this.student = student; }
    public Practical getPractical() { return practical; }
    public void setPractical(Practical practical) { this.practical = practical; }
    public CodeLanguage getLanguage() { return language; }
    public void setLanguage(CodeLanguage language) { this.language = language; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }
    public String getExecutionStatus() { return executionStatus; }
    public void setExecutionStatus(String executionStatus) { this.executionStatus = executionStatus; }
    public String getConclusionText() { return conclusionText; }
    public void setConclusionText(String conclusionText) { this.conclusionText = conclusionText; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
