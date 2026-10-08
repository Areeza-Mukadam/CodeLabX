package com.codelabx.progress;

public enum PracticalStep {
    AIM,
    THEORY,
    ALGORITHM,
    PRACTICE,
    CODE,
    CONCLUSION;

    public int index() {
        return ordinal();
    }

    public PracticalStep next() {
        int i = ordinal() + 1;
        return i < values().length ? values()[i] : this;
    }

    public boolean isBeforeOrEqual(PracticalStep other) {
        return ordinal() <= other.ordinal();
    }
}
