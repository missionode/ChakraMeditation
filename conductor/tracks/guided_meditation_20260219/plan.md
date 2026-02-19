# Implementation Plan: Guided Serialized Meditation Session

## Phase 1: Infrastructure & Testing Setup [checkpoint: 7495485]
Establish a testing environment and baseline to support TDD and measure code coverage (>80%).

- [x] **Task 1: Initialize testing environment (Vitest/JSDOM).** a613619
- [x] **Task 2: Create unit tests for existing `studio.html` logic (e.g., timer calculation).** a613619
- [x] **Task 3: Refactor existing timer logic for testability.** a613619
- [x] **Task 4: Conductor - User Manual Verification 'Phase 1: Infrastructure' (Protocol in workflow.md).** a613619

## Phase 2: Audio Guidance (Narration) [checkpoint: b14814c]
Implement the `ChakraGuidance` module using the Web Speech API.

- [x] **Task 5: Write unit tests for `ChakraGuidance` (narration logic).** c8377ae
- [x] **Task 6: Implement `ChakraGuidance` to read Chakra Name, Mantra, and Description.** c8377ae
- [x] **Task 7: Write tests for narration tone and pacing (mocked speechSynthesis).** c8377ae
- [x] **Task 8: Refine narration with a 2-3 second post-narration pause.** c8377ae
- [x] **Task 9: Conductor - User Manual Verification 'Phase 2: Narration' (Protocol in workflow.md).** c8377ae

## Phase 3: Session Flow & Automation [checkpoint: d5b9fb3]
Implement the `MeditationSessionManager` to handle the serialized flow between chakras.

- [x] **Task 10: Write unit tests for `MeditationSessionManager` (state transitions).** 30024f7
- [x] **Task 11: Implement `MeditationSessionManager` to automate transitions (Guidance -> Pause -> Timer).** 30024f7
- [x] **Task 12: Write tests for automatic advance to next chakra after bell rings.** d03dd7f
- [x] **Task 13: Implement sequential chakra advance logic.** d03dd7f
- [x] **Task 14: Conductor - User Manual Verification 'Phase 3: Session Flow' (Protocol in workflow.md).** d03dd7f

## Phase 4: Integration & Visual Polish
Refactor `studio.html` to use the new automated flow and add breathing animations.

- [ ] **Task 15: Write integration tests for the guided meditation UI.**
- [ ] **Task 16: Integrate `MeditationSessionManager` with `studio.html` Start Session button.**
- [ ] **Task 17: Implement CSS pulsing animations for the active chakra symbol.**
- [ ] **Task 18: Final end-to-end verification of the serialized flow on mobile.**
- [ ] **Task 19: Conductor - User Manual Verification 'Phase 4: Integration' (Protocol in workflow.md).**
