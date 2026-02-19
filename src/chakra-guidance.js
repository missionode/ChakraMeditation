export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    const preferred = voices.find(v => v.lang === 'en-IN' && (v.name.includes('Veena') || v.name.includes('Heera') || v.name.includes('Female')));
    if (preferred) return preferred;
    const indian = voices.find(v => v.lang === 'en-IN');
    if (indian) return indian;
    return null;
  }

  /**
   * Constructs an array of phrases with internal pauses for maximum "stretch".
   */
  constructPhrases(chakra) {
    return [
      `Now. . . Focus. . . on your. . . ${chakra.name}.`,
      `The mantra. . . for this chakra. . . is. . . ${chakra.mantra}.`,
      `Gently. . . locate your focus. . . at the. . . ${chakra.location}.`,
      `It embodies. . . the power. . . of. . . ${chakra.feature}.`,
      `And is associated. . . with the element. . . ${chakra.element}.`,
      `${chakra.description}.`
    ];
  }

  /**
   * Recursively speaks phrases with moderate meditative pauses.
   */
  _speakPhrases(phrases, index, onEndCallback) {
    if (index >= phrases.length) {
      // Final transition pause (1.5 seconds)
      setTimeout(() => {
        if (onEndCallback) onEndCallback();
      }, 1500);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(phrases[index]);
    const voice = this._getBestVoice();
    if (voice) utterance.voice = voice;

    // Extreme stretch tuning
    utterance.rate = 0.4;  // Extremely slow
    utterance.pitch = 0.9; // Smooth tone
    utterance.volume = 1.0;

    utterance.onend = () => {
      // Moderate pause (1.2 seconds) between full stops
      setTimeout(() => {
        this._speakPhrases(phrases, index + 1, onEndCallback);
      }, 1200);
    };

    utterance.onerror = () => {
      this._speakPhrases(phrases, index + 1, onEndCallback);
    };

    this.synth.speak(utterance);
  }

  speakChakra(chakra, onEndCallback) {
    if (!this.synth) return;
    
    this.synth.cancel();
    const phrases = this.constructPhrases(chakra);
    this._speakPhrases(phrases, 0, onEndCallback);
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
