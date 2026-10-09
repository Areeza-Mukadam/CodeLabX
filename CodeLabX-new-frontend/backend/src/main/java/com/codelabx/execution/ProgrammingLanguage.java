package com.codelabx.execution;

import jakarta.persistence.*;

@Entity
@Table(name = "programming_languages")
public class ProgrammingLanguage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true, length = 32) private String name;
    @Column(nullable = false, unique = true, length = 32) private String code;
    @Column(nullable = false, length = 32) private String runtimeVersion;
    @Column(nullable = false) private boolean enabled = true;

    public Long getId(){return id;} public String getName(){return name;} public void setName(String name){this.name=name;}
    public String getCode(){return code;} public void setCode(String code){this.code=code;}
    public String getRuntimeVersion(){return runtimeVersion;} public void setRuntimeVersion(String runtimeVersion){this.runtimeVersion=runtimeVersion;}
    public boolean isEnabled(){return enabled;} public void setEnabled(boolean enabled){this.enabled=enabled;}
}
