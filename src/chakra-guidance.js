export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
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
    
    // Set a calm, slow pace
    utterance.rate = 0.8;
    utterance.pitch = 1.0;

    if (onEndCallback) {
      utterance.onend = () => {
        // Mindful transition: 2 second pause after guidance
        setTimeout(() => {
          onEndCallback();
        }, 2000);
      };
    }

    if (this.synth) {
      this.synth.speak(utterance);
    }
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
