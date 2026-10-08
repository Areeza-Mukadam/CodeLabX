package com.codelabx.evaluation;

import com.codelabx.viva.VivaQuestion;
import jakarta.persistence.*;

@Entity
@Table(name = "viva_marks")
public class VivaMark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id")
    private Evaluation evaluation;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "viva_question_id")
    private VivaQuestion vivaQuestion;

    @Column(length = 8000)
    private String studentAnswerNotes;

    private Integer awardedMarks;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Evaluation getEvaluation() { return evaluation; }
    public void setEvaluation(Evaluation evaluation) { this.evaluation = evaluation; }
    public VivaQuestion getVivaQuestion() { return vivaQuestion; }
    public void setVivaQuestion(VivaQuestion vivaQuestion) { this.vivaQuestion = vivaQuestion; }
    public String getStudentAnswerNotes() { return studentAnswerNotes; }
    public void setStudentAnswerNotes(String studentAnswerNotes) { this.studentAnswerNotes = studentAnswerNotes; }
    public Integer getAwardedMarks() { return awardedMarks; }
    public void setAwardedMarks(Integer awardedMarks) { this.awardedMarks = awardedMarks; }
}
