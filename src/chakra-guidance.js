export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null; 
  }

  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    const priorityNames = ['Lakshmi', 'Lekha', 'Veena', 'Sangeeta', 'Heera'];
    for (const name of priorityNames) {
        const found = voices.find(v => v.name.includes(name));
        if (found) return found;
    }

    // Snippet-inspired: Find a voice that matches en-IN and includes 'India'
    const indianVoice = voices.find(v => v.lang === 'en-IN' && v.name.includes('India'));
    if (indianVoice) return indianVoice;

    return voices.find(v => v.lang === 'en-IN') || null;
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

    const voice = this._getBestVoice();
    this.currentUtterance = new SpeechSynthesisUtterance(phrases[index]);
    
    if (voice) {
        this.currentUtterance.voice = voice;
        // CRITICAL FIX: Match utterance language to the selected voice's language
        this.currentUtterance.lang = voice.lang;
    } else {
        // Snippet-inspired fallback
        this.currentUtterance.lang = 'en-IN';
    }

    this.currentUtterance.rate = 0.7; 
    this.currentUtterance.pitch = 1.0; 
    this.currentUtterance.volume = 1.0;

    this.currentUtterance.onend = () => {
      setTimeout(() => {
        this._speakPhrases(phrases, index + 1, onEndCallback);
      }, 1500);
    };

    this.currentUtterance.onerror = (e) => {
      console.error("Speech error:", e);
      this._speakPhrases(phrases, index + 1, onEndCallback);
    };

    this.synth.speak(this.currentUtterance);
  }

  speakChakra(chakra, onEndCallback) {
    if (!this.synth) return;
    
    // Cancel any current speech to start fresh
    this.synth.cancel();

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
