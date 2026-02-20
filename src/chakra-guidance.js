import { getStoredVoiceSettings } from './voice-settings.js';

export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
  }

  _getBestVoice(preferredName) {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // 1. Try preferred voice from settings
    if (preferredName) {
        const preferred = voices.find(v => v.name === preferredName);
        if (preferred) return preferred;
    }

    // 2. Fallback to Lekha (our target)
    const lekha = voices.find(v => v.name.includes('Lekha'));
    if (lekha) return lekha;

    // 3. Fallback to Indian female
    const indianFemaleNames = ['Sangeeta', 'Veena', 'Priya', 'Heera', 'Google हिन्दी'];
    const preferred = voices.find(v => 
      v.lang.includes('IN') && 
      (indianFemaleNames.some(name => v.name.includes(name)) || v.name.toLowerCase().includes('female'))
    );
    return preferred || voices.find(v => v.lang.includes('IN')) || null;
  }

  constructPhrases(chakra) {
    return [
      `Now, bring your focus, to your ${chakra.name}.`,
      `The sacred mantra, for this chakra, is ${chakra.mantra}.`,
      `Gently locate, your awareness, at the ${chakra.location}.`,
      `It embodies, the power of ${chakra.feature}, and is associated, with the element, ${chakra.element}.`,
      `${chakra.description}.`,
      `It is deeply connected to your ${chakra.associated}.`
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

    const settings = getStoredVoiceSettings();
    const voice = this._getBestVoice(settings.voiceName);
    
    // Create and store on the instance to prevent Garbage Collection on mobile
    this.currentUtterance = new SpeechSynthesisUtterance(phrases[index]);
    
    if (voice) {
        this.currentUtterance.voice = voice;
        this.currentUtterance.lang = voice.lang;
    }

    this.currentUtterance.rate = settings.rate || 0.7; 
    this.currentUtterance.pitch = settings.pitch || 1.0; 
    this.currentUtterance.volume = settings.volume || 1.0;

    this.currentUtterance.onend = () => {
      // Small pause before next phrase
      setTimeout(() => {
        if (this.currentUtterance) { // Check if not cancelled
            this._speakPhrases(phrases, index + 1, onEndCallback);
        }
      }, 1500);
    };

    this.currentUtterance.onerror = (e) => {
      console.error("Speech error:", e);
      if (e.error !== 'interrupted') {
          this._speakPhrases(phrases, index + 1, onEndCallback);
      }
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
