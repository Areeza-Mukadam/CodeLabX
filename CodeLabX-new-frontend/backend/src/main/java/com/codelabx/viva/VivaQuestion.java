package com.codelabx.viva;

import com.codelabx.practical.Practical;
import jakarta.persistence.*;

@Entity
@Table(name = "viva_questions")
public class VivaQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "practical_id")
    private Practical practical;

    @Column(nullable = false, length = 4000)
    private String question;

    @Column(nullable = false)
    private int marks;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Practical getPractical() { return practical; }
    public void setPractical(Practical practical) { this.practical = practical; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public int getMarks() { return marks; }
    public void setMarks(int marks) { this.marks = marks; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
