# Specification: Guided Serialized Meditation Session

## Goal
Transform the manual meditation flow in `studio.html` into a guided, serialized experience that handles transitions between chakras automatically.

## User Flow
1. **Selection:** User selects chakra interval (ival) in `studio.html`.
2. **Start:** User clicks "Ready Start Session".
3. **Guidance Phase:**
   - App reads Chakra Name (e.g., "Root").
   - Reads Mantra, Location, Power, Element, and Description from the card.
   - Uses a calm, soothing, ethereal voice.
4. **Mindful Transition:** A 2-3 second pause after guidance.
5. **Meditation Phase:**
   - Chakra-specific music starts automatically.
   - Timer begins automatically based on the selected `ival`.
   - Subtle pulsing animation on the chakra symbol.
6. **Completion:** A temple bell rings when the timer ends.
7. **Serialized Advance:** App automatically transitions to the next chakra's Guidance Phase.
8. **Ending:** Session concludes after the last chakra in the sequence is completed.

## Technical Details
- **Narration:** Web Speech API (`window.speechSynthesis`).
- **Flow Control:** JavaScript session manager to handle the state machine (Guidance -> Pause -> Timer -> Bell -> Next).
- **Animations:** CSS transitions for pulsing chakra symbols.
- **Data Source:** Existing DOM content in `studio.html` for chakra details.
