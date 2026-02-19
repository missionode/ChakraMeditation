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
   * Constructs phrases with strategic punctuation for maximum clarity and meditative flow.
   */
  constructPhrases(chakra) {
    return [
      `Gently, focus your attention, on your, ${chakra.name}.`,
      `The sacred mantra, for this chakra, is, ${chakra.mantra}.`,
      `Locate your awareness, at the, ${chakra.location}.`,
      `It embodies, the power of, ${chakra.feature}.`,
      `And is associated, with the element, ${chakra.element}.`,
      `${chakra.description}.`
    ];
  }

  _speakPhrases(phrases, index, onEndCallback) {
    if (index >= phrases.length) {
      // Mindful pause before the meditation music starts
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

    // Meditative Configuration: 0.72 is slow enough for clarity but fast enough to sound natural
    utterance.rate = 0.72; 
    utterance.pitch = 1.0; 
    utterance.volume = 1.0;

    utterance.onend = () => {
      // 1.5s pause between sentences for reflection
      setTimeout(() => {
        this._speakPhrases(phrases, index + 1, onEndCallback);
      }, 1500);
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
