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
   * Constructs an array of phrases to allow for controlled pauses between sentences.
   */
  constructPhrases(chakra) {
    return [
      `Now. . . Focus on your ${chakra.name}.`,
      `The mantra for this chakra. . . is. . . ${chakra.mantra}.`,
      `Gently. . . locate your focus. . . at the ${chakra.location}.`,
      `It embodies the power. . . of ${chakra.feature}.`,
      `And is associated. . . with the element. . . ${chakra.element}.`,
      `${chakra.description}.`
    ];
  }

  /**
   * Recursively speaks an array of phrases with a delay between each.
   */
  _speakPhrases(phrases, index, onEndCallback) {
    if (index >= phrases.length) {
      // Final transition pause after the last phrase is finished
      setTimeout(() => {
        if (onEndCallback) onEndCallback();
      }, 2000);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(phrases[index]);
    const voice = this._getBestVoice();
    if (voice) utterance.voice = voice;

    // Stretchy, very slow pace
    utterance.rate = 0.5; 
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      // Pause after full stop (1.5 seconds) before next phrase
      setTimeout(() => {
        this._speakPhrases(phrases, index + 1, onEndCallback);
      }, 1500);
    };

    utterance.onerror = () => {
      // Fallback to continue on error
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
