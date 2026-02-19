export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // 1. Specifically target 'Lekha' - the sweet Indian female voice found on your device
    const lekha = voices.find(v => v.name.includes('Lekha'));
    if (lekha) return lekha;

    // 2. Fallback to any other Indian female voice names just in case
    const indianFemaleNames = ['Sangeeta', 'Veena', 'Priya', 'Heera', 'Google हिन्दी'];
    const preferred = voices.find(v => 
      v.lang.includes('IN') && 
      (indianFemaleNames.some(name => v.name.includes(name)) || v.name.toLowerCase().includes('female'))
    );
    if (preferred) return preferred;

    // 3. Fallback to a clear English female voice if no Indian female is found
    const englishFemale = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Samantha'));
    if (englishFemale) return englishFemale;

    // 4. Last resort
    return voices.find(v => v.lang.includes('IN')) || null;
  }

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

  _speakPhrases(phrases, index, onEndCallback) {
    if (index >= phrases.length) {
      setTimeout(() => {
        if (onEndCallback) onEndCallback();
      }, 1500);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(phrases[index]);
    const voice = this._getBestVoice();
    
    if (voice) {
      utterance.voice = voice;
      if (index === 0) console.log("ChakraGuidance selected voice:", voice.name);
    }

    // Meditation Tuning
    utterance.rate = 0.45; // Extremely slow and stretchy
    utterance.pitch = 1.0; 
    utterance.volume = 1.0;

    utterance.onend = () => {
      setTimeout(() => {
        this._speakPhrases(phrases, index + 1, onEndCallback);
      }, 1200);
    };

    utterance.onerror = (e) => {
      console.error("Speech error:", e);
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
