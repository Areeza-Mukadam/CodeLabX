package com.codelabx.integrity;

import com.codelabx.practical.Practical;
import com.codelabx.user.UserAccount;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "integrity_events")
public class IntegrityEvent {

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
    private IntegrityEventType eventType;

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    @Column(length = 2000)
    private String metadata;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserAccount getStudent() { return student; }
    public void setStudent(UserAccount student) { this.student = student; }
    public Practical getPractical() { return practical; }
    public void setPractical(Practical practical) { this.practical = practical; }
    public IntegrityEventType getEventType() { return eventType; }
    public void setEventType(IntegrityEventType eventType) { this.eventType = eventType; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
}
