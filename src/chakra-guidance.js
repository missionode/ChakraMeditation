export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // List of known high-quality Indian English female voices across platforms
    const indianFemaleNames = ['Veena', 'Heera', 'Sangeeta', 'Priya', 'Neerja', 'Google English (India)'];
    
    // 1. Try to find a specific Indian English female voice by name or 'Female' tag
    const preferred = voices.find(v => 
      v.lang.includes('IN') && 
      (indianFemaleNames.some(name => v.name.includes(name)) || v.name.toLowerCase().includes('female'))
    );
    if (preferred) return preferred;

    // 2. Fallback to any Indian English voice that doesn't explicitly say 'Male'
    const anyIndian = voices.find(v => v.lang.includes('IN') && !v.name.toLowerCase().includes('male'));
    if (anyIndian) return anyIndian;

    // 3. Fallback to any English female voice (US/UK/AU) for the 'sweet' tone
    const anyFemale = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
    if (anyFemale) return anyFemale;

    // 4. Last resort: first Indian voice found
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
      if (index === 0) console.log("ChakraGuidance selecting voice:", voice.name, voice.lang);
    }

    utterance.rate = 0.4;  
    utterance.pitch = 1.1; // Slightly higher pitch helps a voice sound more female/sweet
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
