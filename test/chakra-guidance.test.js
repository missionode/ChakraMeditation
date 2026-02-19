import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChakraGuidance } from '../src/chakra-guidance';

describe('ChakraGuidance Integration', () => {
  let guidance;
  let mockSpeechSynthesis;
  let utterances;

  beforeEach(() => {
    vi.useFakeTimers();
    utterances = [];
    
    global.SpeechSynthesisUtterance = function(text) {
      const u = {
        text: text,
        onend: null,
        rate: 1.0,
        pitch: 1.0,
        voice: null,
        lang: '',
        volume: 1.0
      };
      utterances.push(u);
      return u;
    };

    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => [
        { name: 'Google English (India)', lang: 'en-IN' },
        { name: 'Lekha', lang: 'hi-IN' }
      ]),
      pending: false,
      speaking: false
    };
    
    global.window = global.window || {};
    global.window.speechSynthesis = mockSpeechSynthesis;

    guidance = new ChakraGuidance();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set lang to en-IN for utterances', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(utterances[0].lang).toBe('en-IN');
  });

  it('should cancel pending speech before starting new session', () => {
    mockSpeechSynthesis.pending = true;
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  });

  it('should prefer "India" in voice name if priority names are missing', () => {
    mockSpeechSynthesis.getVoices = vi.fn(() => [
        { name: 'Rishi', lang: 'en-IN' },
        { name: 'Generic India Voice', lang: 'en-IN' }
    ]);
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(utterances[0].voice.name).toBe('Generic India Voice');
  });
});
