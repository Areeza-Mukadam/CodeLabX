package com.codelabx.practical;

import com.codelabx.user.UserAccount;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "practical_assignments", uniqueConstraints = @UniqueConstraint(columnNames = {"practical_id", "student_id"}))
public class PracticalAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "practical_id")
    private Practical practical;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private UserAccount student;

    @Column(nullable = false)
    private Instant assignedAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Practical getPractical() { return practical; }
    public void setPractical(Practical practical) { this.practical = practical; }
    public UserAccount getStudent() { return student; }
    public void setStudent(UserAccount student) { this.student = student; }
    public Instant getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }
}
