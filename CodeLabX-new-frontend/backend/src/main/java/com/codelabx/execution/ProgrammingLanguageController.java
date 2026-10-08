package com.codelabx.execution;

import com.codelabx.common.ApiException;
import com.codelabx.practical.PracticalRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class ProgrammingLanguageController {
    private final ProgrammingLanguageRepository languages;
    private final PracticalRepository practicals;
    public ProgrammingLanguageController(ProgrammingLanguageRepository languages, PracticalRepository practicals){this.languages=languages;this.practicals=practicals;}

    @GetMapping("/api/languages")
    public List<LanguageView> available(){return languages.findByEnabledTrueOrderByNameAsc().stream().map(LanguageView::from).toList();}
    @GetMapping("/api/admin/languages") @PreAuthorize("hasRole('ADMIN')")
    public List<LanguageView> all(){return languages.findAllByOrderByNameAsc().stream().map(LanguageView::from).toList();}
    @PostMapping("/api/admin/languages") @PreAuthorize("hasRole('ADMIN')")
    public LanguageView create(@Valid @RequestBody LanguageRequest request){
        String code=request.code().trim().toUpperCase();
        requireRunnable(code);
        if(languages.existsByCodeIgnoreCase(code)||languages.existsByNameIgnoreCase(request.name().trim())) throw new ApiException(HttpStatus.CONFLICT,"That language is already configured.");
        var l=new ProgrammingLanguage(); l.setCode(code);l.setName(request.name().trim());l.setRuntimeVersion(request.runtimeVersion().trim());l.setEnabled(request.enabled()); return LanguageView.from(languages.save(l));
    }
    @PutMapping("/api/admin/languages/{id}") @PreAuthorize("hasRole('ADMIN')")
    public LanguageView update(@PathVariable Long id,@Valid @RequestBody LanguageRequest request){
        var l=languages.findById(id).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"Language not found."));
        String code=request.code().trim().toUpperCase(); requireRunnable(code);
        if(!l.getCode().equalsIgnoreCase(code)||!l.getName().equalsIgnoreCase(request.name().trim())) throw new ApiException(HttpStatus.BAD_REQUEST,"A runtime's name and code are fixed by the configured execution provider.");
        l.setRuntimeVersion(request.runtimeVersion().trim());l.setEnabled(request.enabled());return LanguageView.from(languages.save(l));
    }
    @DeleteMapping("/api/admin/languages/{id}") @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id){var l=languages.findById(id).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"Language not found."));if(practicals.existsByProgrammingLanguageIgnoreCase(l.getName()))throw new ApiException(HttpStatus.CONFLICT,"This language is referenced by practicals. Disable it instead.");languages.delete(l);}
    private void requireRunnable(String code){try{CodeLanguage.valueOf(code);}catch(Exception e){throw new ApiException(HttpStatus.BAD_REQUEST,"Only runtimes supported by the configured code execution provider can be managed.");}}
    public record LanguageRequest(@NotBlank String name,@NotBlank String code,@NotBlank String runtimeVersion,boolean enabled){}
    public record LanguageView(Long id,String name,String code,String runtimeVersion,boolean enabled){static LanguageView from(ProgrammingLanguage l){return new LanguageView(l.getId(),l.getName(),l.getCode(),l.getRuntimeVersion(),l.isEnabled());}}
}
