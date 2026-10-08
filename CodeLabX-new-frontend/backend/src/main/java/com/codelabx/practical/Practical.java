package com.codelabx.practical;

import com.codelabx.user.UserAccount;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "practicals")
public class Practical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 120)
    private String subject;

    private Integer semester;

    private Integer experimentNumber;
    @Column(length = 32) private String programmingLanguage;
    @Column(length = 500) private String sourcePdfPath;
    @Column(length = 255) private String sourcePdfName;

    @Column(length = 4000)
    private String description;

    @Column(length = 8000)
    private String aim;

    @Column(length = 16000)
    private String theory;

    @Column(length = 8000)
    private String algorithm;

    @Column(length = 8000)
    private String codeInstructions;

    @Column(length = 8000)
    private String conclusion;

    @Column(length = 8000)
    private String javaStarterCode;

    @Column(length = 8000)
    private String pythonStarterCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PracticalStatus status = PracticalStatus.DRAFT;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private UserAccount createdBy;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public Integer getExperimentNumber() { return experimentNumber; }
    public void setExperimentNumber(Integer experimentNumber) { this.experimentNumber = experimentNumber; }
    public String getProgrammingLanguage() { return programmingLanguage; }
    public void setProgrammingLanguage(String programmingLanguage) { this.programmingLanguage = programmingLanguage; }
    public String getSourcePdfPath() { return sourcePdfPath; }
    public void setSourcePdfPath(String sourcePdfPath) { this.sourcePdfPath = sourcePdfPath; }
    public String getSourcePdfName() { return sourcePdfName; }
    public void setSourcePdfName(String sourcePdfName) { this.sourcePdfName = sourcePdfName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAim() { return aim; }
    public void setAim(String aim) { this.aim = aim; }
    public String getTheory() { return theory; }
    public void setTheory(String theory) { this.theory = theory; }
    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }
    public String getCodeInstructions() { return codeInstructions; }
    public void setCodeInstructions(String codeInstructions) { this.codeInstructions = codeInstructions; }
    public String getConclusion() { return conclusion; }
    public void setConclusion(String conclusion) { this.conclusion = conclusion; }
    public String getJavaStarterCode() { return javaStarterCode; }
    public void setJavaStarterCode(String javaStarterCode) { this.javaStarterCode = javaStarterCode; }
    public String getPythonStarterCode() { return pythonStarterCode; }
    public void setPythonStarterCode(String pythonStarterCode) { this.pythonStarterCode = pythonStarterCode; }
    public PracticalStatus getStatus() { return status; }
    public void setStatus(PracticalStatus status) { this.status = status; }
    public UserAccount getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserAccount createdBy) { this.createdBy = createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
