package com.codelabx.practical;

import com.codelabx.user.UserAccount;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "practical_assignments", uniqueConstraints = {@UniqueConstraint(columnNames = {"practical_id", "student_id"}), @UniqueConstraint(columnNames = {"practical_id", "class_section", "class_department"})}, indexes = {@Index(columnList = "class_section"), @Index(columnList = "practical_id")})
public class PracticalAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "practical_id")
    private Practical practical;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private UserAccount student;

    @Column(name = "class_section", length = 100)
    private String classSection;

    @Column(name = "class_department", length = 120)
    private String classDepartment;

    @Column(length = 2000)
    private String instructions;

    private Instant dueAt;

    @Column(nullable = false)
    private Instant assignedAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Practical getPractical() { return practical; }
    public void setPractical(Practical practical) { this.practical = practical; }
    public UserAccount getStudent() { return student; }
    public void setStudent(UserAccount student) { this.student = student; }
    public String getClassSection() { return classSection; }
    public void setClassSection(String classSection) { this.classSection = classSection; }
    public String getClassDepartment() { return classDepartment; }
    public void setClassDepartment(String classDepartment) { this.classDepartment = classDepartment; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public Instant getDueAt() { return dueAt; }
    public void setDueAt(Instant dueAt) { this.dueAt = dueAt; }
    public Instant getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }
}
