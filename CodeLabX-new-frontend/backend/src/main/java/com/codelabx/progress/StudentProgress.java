package com.codelabx.progress;

import com.codelabx.practical.Practical;
import com.codelabx.user.UserAccount;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "student_progress", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "practical_id"}))
public class StudentProgress {

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
    private PracticalStep currentStep = PracticalStep.AIM;

    @Column(nullable = false, length = 500)
    private String completedSteps = "";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgressStatus status = ProgressStatus.NOT_STARTED;

    @Column(length = 16000)
    private String practiceAnswersJson = "{}";

    @Column(length = 16000)
    private String conclusionText = "";

    @Column(length = 16000)
    private String draftCode = "";

    @Column(length = 32)
    private String draftLanguage = "JAVA";

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    @PrePersist
    void touch() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserAccount getStudent() { return student; }
    public void setStudent(UserAccount student) { this.student = student; }
    public Practical getPractical() { return practical; }
    public void setPractical(Practical practical) { this.practical = practical; }
    public PracticalStep getCurrentStep() { return currentStep; }
    public void setCurrentStep(PracticalStep currentStep) { this.currentStep = currentStep; }
    public String getCompletedSteps() { return completedSteps; }
    public void setCompletedSteps(String completedSteps) { this.completedSteps = completedSteps; }
    public ProgressStatus getStatus() { return status; }
    public void setStatus(ProgressStatus status) { this.status = status; }
    public String getPracticeAnswersJson() { return practiceAnswersJson; }
    public void setPracticeAnswersJson(String practiceAnswersJson) { this.practiceAnswersJson = practiceAnswersJson; }
    public String getConclusionText() { return conclusionText; }
    public void setConclusionText(String conclusionText) { this.conclusionText = conclusionText; }
    public String getDraftCode() { return draftCode; }
    public void setDraftCode(String draftCode) { this.draftCode = draftCode; }
    public String getDraftLanguage() { return draftLanguage; }
    public void setDraftLanguage(String draftLanguage) { this.draftLanguage = draftLanguage; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
