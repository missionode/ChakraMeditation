export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null; 
  }

  /**
   * Finds the best available Indian voice based on your logic and device availability.
   */
  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // 1. Specific name-based matches (Priority for requested sweet voices)
    const priorityNames = ['Lakshmi', 'Lekha', 'Veena', 'Sangeeta', 'Heera'];
    for (const name of priorityNames) {
        const found = voices.find(v => v.name.includes(name));
        if (found) return found;
    }

    // 2. Snippet-inspired: Find a voice that matches en-IN and includes 'India'
    const indianVoice = voices.find(v => v.lang === 'en-IN' && v.name.includes('India'));
    if (indianVoice) return indianVoice;

    // 3. Fallback to any en-IN voice
    const anyEnIn = voices.find(v => v.lang === 'en-IN');
    if (anyEnIn) return anyEnIn;

    return null;
  }

  constructPhrases(chakra) {
    return [
      `Now, bring your focus, to your ${chakra.name}.`,
      `The sacred mantra, for this chakra, is ${chakra.mantra}.`,
      `Gently locate, your awareness, at the ${chakra.location}.`,
      `It embodies, the power of ${chakra.feature}, and is associated, with the element, ${chakra.element}.`,
      `${chakra.description}.`
    ];
  }

  _speakPhrases(phrases, index, onEndCallback) {
    if (index >= phrases.length) {
      this.currentUtterance = null;
      setTimeout(() => {
        if (onEndCallback) onEndCallback();
      }, 2000); 
      return;
    }

    this.currentUtterance = new SpeechSynthesisUtterance(phrases[index]);
    
    // Snippet-inspired: Explicitly set language to English (India)
    this.currentUtterance.lang = 'en-IN';

    const voice = this._getBestVoice();
    if (voice) {
        this.currentUtterance.voice = voice;
    }

    // Meditative Configuration
    this.currentUtterance.rate = 0.7; 
    this.currentUtterance.pitch = 1.0; 
    this.currentUtterance.volume = 1.0;

    this.currentUtterance.onend = () => {
      setTimeout(() => {
        this._speakPhrases(phrases, index + 1, onEndCallback);
      }, 1500);
    };

    this.currentUtterance.onerror = (e) => {
      this._speakPhrases(phrases, index + 1, onEndCallback);
    };

    this.synth.speak(this.currentUtterance);
  }

  speakChakra(chakra, onEndCallback) {
    if (!this.synth) return;
    
    // Snippet-inspired: Cancel if there's a pending speech
    if (this.synth.pending || this.synth.speaking) {
      this.synth.cancel();
    }

    const phrases = this.constructPhrases(chakra);
    this._speakPhrases(phrases, 0, onEndCallback);
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
}
