export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null; 
  }

  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // 1. Try to find 'Lakshmi' as requested
    const lakshmi = voices.find(v => v.name.includes('Lakshmi'));
    if (lakshmi) return lakshmi;

    // 2. Fallback to 'Lekha' (the high-quality voice detected on your device)
    const lekha = voices.find(v => v.name.includes('Lekha'));
    if (lekha) return lekha;

    // 3. General Indian female fallbacks
    const indianFemaleNames = ['Sangeeta', 'Veena', 'Priya', 'Heera', 'Google हिन्दी'];
    const preferred = voices.find(v => 
      v.lang.includes('IN') && 
      (indianFemaleNames.some(name => v.name.includes(name)) || v.name.toLowerCase().includes('female'))
    );
    if (preferred) return preferred;

    return voices.find(v => v.lang.includes('IN')) || null;
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
    const voice = this._getBestVoice();
    if (voice) this.currentUtterance.voice = voice;

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
