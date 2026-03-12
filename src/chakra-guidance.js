import { getStoredVoiceSettings } from './voice-settings.js';

export class ChakraGuidance {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.currentSessionId = 0;
  }

  _getBestVoice(preferredName, language) {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // 1. Try preferred voice from settings
    if (preferredName) {
        const preferred = voices.find(v => v.name === preferredName);
        if (preferred) return preferred;
    }

    // 2. Try to find a voice for the requested language
    const langVoices = voices.filter(v => v.lang.startsWith(language.split('-')[0]));
    if (langVoices.length > 0) {
        if (language.startsWith('ml')) {
            const lekha = langVoices.find(v => v.name.includes('Lekha'));
            if (lekha) return lekha;
        }
        return langVoices[0];
    }

    // 3. Fallback to Lekha
    const lekha = voices.find(v => v.name.includes('Lekha'));
    if (lekha) return lekha;

    // 4. Fallback to Indian female
    const indianFemaleNames = ['Sangeeta', 'Veena', 'Priya', 'Heera', 'Google हिन्दी'];
    const preferred = voices.find(v => 
      v.lang.includes('IN') && 
      (indianFemaleNames.some(name => v.name.includes(name)) || v.name.toLowerCase().includes('female'))
    );
    return preferred || voices.find(v => v.lang.includes('IN')) || null;
  }

  constructPhrases(chakra, language, localizedContent) {
    // Priority 1: Use external localized content (JSON driven) if available
    if (localizedContent && localizedContent[language]) {
        const langData = localizedContent[language];
        const chakraData = langData[chakra.name] || { name: chakra.name, mantra: chakra.mantra, loc: chakra.location };
        
        return langData.guidance.map(phrase => {
            return phrase
                .replace(/{name}/g, chakraData.name || "").replace(/{mantra}/g, chakraData.mantra || "").replace(/{loc}/g, chakraData.loc || "").replace(/{deity}/g, chakraData.deity || "").replace(/{shakti}/g, chakraData.shakti || "");
        });
    }

    // Priority 2: Fallback to internal Malayalam if requested
    if (language.startsWith('ml')) {
        return [
            `നമസ്കാരം, നമുക്ക് ഇപ്പോൾ ${chakra.name} ലേക്ക് ശ്രദ്ധ കൊണ്ടുവരാം`,
            `ഈ ചക്രത്തിൻറെ പവിത്രമായ മന്ത്രം ${chakra.mantra} എന്നാണ്`,
            `അവബോധം ഇപ്പോൾ ${chakra.location} ലേക്ക് ശ്രദ്ധയോടെ പകരുക`,
            `മനസ്സിനുള്ളിൽ ഈ മന്ത്രം ജപിക്കുമ്പോൾ ആ ഊർജ്ജം സാവധാനം അനുഭവിക്കുക`,
            `ശാന്തമായും പൂർണ്ണമായ അവബോധത്തോടെയും ഇരിക്കുക`
        ];
    }

    // Priority 3: Default English
    return [
      `Welcome to this meditation, let us gently bring our awareness to the ${chakra.name}`,
      `The sacred mantra for this chakra is ${chakra.mantra}`,
      `Softly focus your attention at the ${chakra.location}`,
      `As you chant this sacred sound, feel its divine energy filling within you`,
      `Stay peaceful, and stay aware`
    ];
  }

  _speakPhrases(phrases, index, language, onEndCallback, sessionId) {
    if (sessionId !== this.currentSessionId) return;

    if (index >= phrases.length) {
      this.currentUtterance = null;
      setTimeout(() => {
        if (sessionId === this.currentSessionId && onEndCallback) onEndCallback();
      }, 1000); 
      return;
    }

    const settings = getStoredVoiceSettings();
    const voice = this._getBestVoice(settings.voiceName, language);
    
    this.currentUtterance = new SpeechSynthesisUtterance(phrases[index]);
    
    if (voice) {
        this.currentUtterance.voice = voice;
        this.currentUtterance.lang = voice.lang;
    } else {
        this.currentUtterance.lang = language;
    }

    this.currentUtterance.rate = settings.rate || 0.8; 
    this.currentUtterance.pitch = settings.pitch || 1.0; 
    this.currentUtterance.volume = settings.volume || 1.0;

    this.currentUtterance.onend = () => {
      if (sessionId === this.currentSessionId) {
          this._speakPhrases(phrases, index + 1, language, onEndCallback, sessionId);
      }
    };

    this.currentUtterance.onerror = (e) => {
      if (sessionId === this.currentSessionId) {
          setTimeout(() => this._speakPhrases(phrases, index + 1, language, onEndCallback, sessionId), 100);
      }
    };

    if (this.synth.paused) this.synth.resume();
    this.synth.speak(this.currentUtterance);
  }

  speakChakra(chakra, onEndCallback, localizedContent) {
    if (!this.synth) {
        if (onEndCallback) onEndCallback();
        return;
    }

    this.synth.cancel();
    this.currentSessionId++;
    const sessionId = this.currentSessionId;
    
    const settings = getStoredVoiceSettings();
    const language = settings.language || 'ml-IN';
    
    // We now use the language directly without falling back to English script.
    // The constructPhrases logic will now honor 'ml-IN' if it's in the settings.
    const phrases = this.constructPhrases(chakra, language, localizedContent);
    
    setTimeout(() => {
        this._speakPhrases(phrases, 0, language, onEndCallback, sessionId);
    }, 100);
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.currentSessionId++;
    }
  }
}
