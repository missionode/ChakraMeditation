export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  _getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    const preferred = voices.find(v => v.lang === 'en-IN' && (v.name.includes('Veena') || v.name.includes('Heera') || v.name.includes('Female')));
    if (preferred) return preferred;
    const indian = voices.find(v => v.lang === 'en-IN');
    if (indian) return indian;
    return null;
  }

  constructText(chakra) {
    // Increased punctuation (commas and periods) to force longer pauses between ideas.
    return `Now. . . Focus on your ${chakra.name}. . . . . 
            The mantra for this chakra. . . is. . . ${chakra.mantra}. . . . . 
            Gently locate your focus. . . at the ${chakra.location}. . . . . 
            It embodies the power. . . of ${chakra.feature}. . . . . 
            And is associated. . . with the element. . . ${chakra.element}. . . . . 
            ${chakra.description}. . . . .`;
  }

  speakChakra(chakra, onEndCallback) {
    const text = this.constructText(chakra);
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = this._getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Meditation Tuning: Very slow and clear
    utterance.rate = 0.65; 
    utterance.pitch = 1.0; 
    utterance.volume = 1.0;

    if (onEndCallback) {
      utterance.onend = () => {
        // Mindful transition: Keep the 2 second pause after the final word
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
