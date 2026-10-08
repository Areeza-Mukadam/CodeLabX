package com.codelabx.integrity;

import com.codelabx.practical.Practical;
import com.codelabx.progress.ProgressService;
import com.codelabx.user.UserAccount;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class IntegrityService {

    private final IntegrityEventRepository repository;
    private final ProgressService progressService;

    public IntegrityService(IntegrityEventRepository repository, ProgressService progressService) {
        this.repository = repository;
        this.progressService = progressService;
    }

    public IntegrityEventDto log(UserAccount student, Long practicalId, IntegrityEventType type, String metadata) {
        Practical practical = progressService.load(practicalId, student).getPractical();
        IntegrityEvent event = new IntegrityEvent();
        event.setStudent(student);
        event.setPractical(practical);
        event.setEventType(type);
        event.setTimestamp(Instant.now());
        event.setMetadata(metadata == null ? "{}" : metadata);
        IntegrityEvent saved = repository.save(event);
        return IntegrityEventDto.from(saved);
    }

    public List<IntegrityEventDto> forStudentPractical(Long studentId, Long practicalId) {
        return repository.findByStudentIdAndPracticalIdOrderByTimestampDesc(studentId, practicalId)
                .stream().map(IntegrityEventDto::from).toList();
    }

    public Map<String, Long> summary(Long studentId, Long practicalId) {
        List<IntegrityEvent> events = repository.findByStudentIdAndPracticalIdOrderByTimestampDesc(studentId, practicalId);
        long copy = events.stream().filter(e -> e.getEventType() == IntegrityEventType.COPY_ATTEMPT).count();
        long cut = events.stream().filter(e -> e.getEventType() == IntegrityEventType.CUT_ATTEMPT).count();
        long paste = events.stream().filter(e -> e.getEventType() == IntegrityEventType.PASTE_ATTEMPT).count();
        return Map.of("COPY_ATTEMPT", copy, "CUT_ATTEMPT", cut, "PASTE_ATTEMPT", paste, "total", (long) events.size());
    }

    public record IntegrityEventDto(Long id, Long studentId, Long practicalId, IntegrityEventType eventType, Instant timestamp, String metadata) {
        static IntegrityEventDto from(IntegrityEvent event) {
            return new IntegrityEventDto(
                    event.getId(),
                    event.getStudent().getId(),
                    event.getPractical().getId(),
                    event.getEventType(),
                    event.getTimestamp(),
                    event.getMetadata()
            );
        }
    }

    public record LogRequest(Long practicalId, IntegrityEventType eventType, String metadata) {}
}
