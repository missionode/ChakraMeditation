export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // Specifically target 'Lekha' for the natural Indian female tone
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
   * Constructs phrases with natural punctuation for better intonation.
   */
  constructPhrases(chakra) {
    return [
      `Now, focus on your ${chakra.name}.`,
      `The mantra for this chakra is ${chakra.mantra}.`,
      `Gently locate your focus at the ${chakra.location}.`,
      `It embodies the power of ${chakra.feature},`,
      `and is associated with the element ${chakra.element}.`,
      `${chakra.description}.`
    ];
  }

  _speakPhrases(phrases, index, onEndCallback) {
    if (index >= phrases.length) {
      setTimeout(() => {
        if (onEndCallback) onEndCallback();
      }, 1000); // 1s final pause
      return;
    }

    const utterance = new SpeechSynthesisUtterance(phrases[index]);
    const voice = this._getBestVoice();
    
    if (voice) {
      utterance.voice = voice;
    }

    // Normalizing for a clear, natural, yet calm flow
    utterance.rate = 0.85; 
    utterance.pitch = 1.0; 
    utterance.volume = 1.0;

    utterance.onend = () => {
      // Natural pause between sentences
      setTimeout(() => {
        this._speakPhrases(phrases, index + 1, onEndCallback);
      }, 800);
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
