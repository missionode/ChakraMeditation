export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  /**
   * Finds the best available Indian English voice, preferably female.
   */
  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // 1. Try to find a specific Indian English female voice (Veena is high quality on macOS)
    const preferred = voices.find(v => v.lang === 'en-IN' && (v.name.includes('Veena') || v.name.includes('Heera') || v.name.includes('Female')));
    if (preferred) return preferred;

    // 2. Fallback to any Indian English voice
    const indian = voices.find(v => v.lang === 'en-IN');
    if (indian) return indian;

    // 3. Last fallback: default system voice
    return null;
  }

  constructText(chakra) {
    return `${chakra.name}. 
            Mantra: ${chakra.mantra}. 
            Location: ${chakra.location}. 
            Power: ${chakra.feature}. 
            Element: ${chakra.element}. 
            Description: ${chakra.description}`;
  }

  speakChakra(chakra, onEndCallback) {
    const text = this.constructText(chakra);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the preferred voice
    const voice = this._getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Set a calm, slow, and sweet pace
    utterance.rate = 0.75; // Slightly slower for more "sweetness" and clarity
    utterance.pitch = 1.1; // Slightly higher pitch for a "sweet" female tone if using a generic voice

    if (onEndCallback) {
      utterance.onend = () => {
        // Mindful transition: 2 second pause after guidance
        setTimeout(() => {
          onEndCallback();
        }, 2000);
      };
    }

    if (this.synth) {
      // Cancel any ongoing speech first
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
