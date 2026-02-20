# Specification: Voice Configuration System

## Goal
Provide a user-friendly interface to customize and persist Text-to-Speech settings (Voice selection, Rate, and Pitch) for the Chakra Guidance system.

## User Flow
1. **Access:** User clicks "Voice Settings" in `settings.html`.
2. **Configuration:**
   - User selects a voice from the system list (prioritizing Indian voices).
   - User adjusts Speed (Rate) and Pitch sliders.
   - User clicks "Test Voice" to hear a sample.
3. **Persistence:** Settings are automatically saved to `localStorage` upon change.
4. **Application:** The `ChakraGuidance` module reads these settings during meditation sessions.

## Technical Details
- **UI:** A streamlined version of `configure-voice.html` styled with the project's 'Poppins' font and `#0d012a` background.
- **Storage Key:** `chakra_voice_settings`.
- **Defaults:** Rate: 0.7, Pitch: 1.0, Language: 'hi-IN' (Lekha).
- **Module Update:** `src/chakra-guidance.js` will prioritize `localStorage` values over hardcoded defaults.
