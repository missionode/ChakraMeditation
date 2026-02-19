export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // Prioritize high-quality Indian English voices
    const preferred = voices.find(v => v.lang === 'en-IN' && (v.name.includes('Veena') || v.name.includes('Heera') || v.name.includes('Female')));
    if (preferred) return preferred;

    const indian = voices.find(v => v.lang === 'en-IN');
    if (indian) return indian;

    return null;
  }

  constructText(chakra) {
    // Using more natural phrasing and punctuation for better prosody
    return `Focus on your ${chakra.name}. 
            The mantra for this chakra is, ${chakra.mantra}. 
            Locate your focus at the ${chakra.location}. 
            It embodies the power of ${chakra.feature}, and is associated with the element, ${chakra.element}. 
            ${chakra.description}.`;
  }

  speakChakra(chakra, onEndCallback) {
    const text = this.constructText(chakra);
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = this._getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Tweak for naturalness: 0.85 - 0.9 is often the sweet spot for "calm but clear"
    utterance.rate = 0.88; 
    utterance.pitch = 1.05; // Slightly higher for clarity without sounding thin
    utterance.volume = 1.0;

    if (onEndCallback) {
      utterance.onend = () => {
        setTimeout(() => {
          onEndCallback();
        }, 2000);
      };
    }

    if (this.synth) {
      this.synth.cancel();
      this.synth.speak(utterance);
    }
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
