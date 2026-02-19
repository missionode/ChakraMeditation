# Implementation Plan: Guided Serialized Meditation Session

## Phase 1: Infrastructure & Testing Setup
Establish a testing environment and baseline to support TDD and measure code coverage (>80%).

- [ ] **Task 1: Initialize testing environment (Vitest/JSDOM).**
- [ ] **Task 2: Create unit tests for existing `studio.html` logic (e.g., timer calculation).**
- [ ] **Task 3: Refactor existing timer logic for testability.**
- [ ] **Task 4: Conductor - User Manual Verification 'Phase 1: Infrastructure' (Protocol in workflow.md).**

## Phase 2: Audio Guidance (Narration)
Implement the `ChakraGuidance` module using the Web Speech API.

- [ ] **Task 5: Write unit tests for `ChakraGuidance` (narration logic).**
- [ ] **Task 6: Implement `ChakraGuidance` to read Chakra Name, Mantra, and Description.**
- [ ] **Task 7: Write tests for narration tone and pacing (mocked speechSynthesis).**
- [ ] **Task 8: Refine narration with a 2-3 second post-narration pause.**
- [ ] **Task 9: Conductor - User Manual Verification 'Phase 2: Narration' (Protocol in workflow.md).**

## Phase 3: Session Flow & Automation
Implement the `MeditationSessionManager` to handle the serialized flow between chakras.

- [ ] **Task 10: Write unit tests for `MeditationSessionManager` (state transitions).**
- [ ] **Task 11: Implement `MeditationSessionManager` to automate transitions (Guidance -> Pause -> Timer).**
- [ ] **Task 12: Write tests for automatic advance to next chakra after bell rings.**
- [ ] **Task 13: Implement sequential chakra advance logic.**
- [ ] **Task 14: Conductor - User Manual Verification 'Phase 3: Session Flow' (Protocol in workflow.md).**

## Phase 4: Integration & Visual Polish
Refactor `studio.html` to use the new automated flow and add breathing animations.

- [ ] **Task 15: Write integration tests for the guided meditation UI.**
- [ ] **Task 16: Integrate `MeditationSessionManager` with `studio.html` Start Session button.**
- [ ] **Task 17: Implement CSS pulsing animations for the active chakra symbol.**
- [ ] **Task 18: Final end-to-end verification of the serialized flow on mobile.**
- [ ] **Task 19: Conductor - User Manual Verification 'Phase 4: Integration' (Protocol in workflow.md).**
