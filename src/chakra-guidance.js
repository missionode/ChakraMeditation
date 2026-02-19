export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // Lekha is the high-quality natural Indian female voice on your device
    const lekha = voices.find(v => v.name.includes('Lekha'));
    if (lekha) return lekha;

    const indianFemaleNames = ['Sangeeta', 'Veena', 'Priya', 'Heera', 'Google हिन्दी'];
    const preferred = voices.find(v => 
      v.lang.includes('IN') && 
      (indianFemaleNames.some(name => v.name.includes(name)) || v.name.toLowerCase().includes('female'))
    );
    if (preferred) return preferred;

    return voices.find(v => v.lang.includes('IN')) || null;
  }

  /**
   * Constructs full, natural sentences.
   * We rely on the TTS engine's natural prosody within the sentence,
   * and insert our meditative pauses BETWEEN the sentences.
   */
  constructPhrases(chakra) {
    return [
      `Now, bring your focus to your ${chakra.name}.`,
      `The sacred mantra for this chakra is ${chakra.mantra}.`,
      `Gently locate your awareness at the ${chakra.location}.`,
      `It embodies the power of ${chakra.feature}, and is associated with the element, ${chakra.element}.`,
      `${chakra.description}.`
    ];
  }

  _speakPhrases(phrases, index, onEndCallback) {
    if (index >= phrases.length) {
      // Final meditative silence before music starts
      setTimeout(() => {
        if (onEndCallback) onEndCallback();
      }, 2000); 
      return;
    }

    const utterance = new SpeechSynthesisUtterance(phrases[index]);
    const voice = this._getBestVoice();
    
    if (voice) {
      utterance.voice = voice;
    }

    // Research-backed Meditative "Sweet Spot"
    utterance.rate = 0.85;  // Slow, but natural (avoids robotic stretching)
    utterance.pitch = 0.9;  // Slightly deeper/warmer for a soothing effect
    utterance.volume = 1.0;

    utterance.onend = () => {
      // The "Breath" Pause: 1.8 seconds of silence between ideas
      setTimeout(() => {
        this._speakPhrases(phrases, index + 1, onEndCallback);
      }, 1800);
    };

    utterance.onerror = (e) => {
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
