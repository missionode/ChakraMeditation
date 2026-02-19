import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChakraGuidance } from '../src/chakra-guidance';

describe('ChakraGuidance', () => {
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
        volume: 1.0
      };
      utterances.push(u);
      return u;
    };

    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => [
        { name: 'Lakshmi', lang: 'en-IN' },
        { name: 'Lekha', lang: 'hi-IN' }
      ]),
    };
    
    global.window = global.window || {};
    global.window.speechSynthesis = mockSpeechSynthesis;

    guidance = new ChakraGuidance();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should prioritize Lakshmi voice if available', () => {
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(utterances[0].voice.name).toBe('Lakshmi');
  });

  it('should fallback to Lekha if Lakshmi is missing', () => {
    mockSpeechSynthesis.getVoices = vi.fn(() => [{ name: 'Lekha', lang: 'hi-IN' }]);
    const chakra = { name: 'Root', mantra: 'L', location: 'B', feature: 'S', element: 'E', description: 'D' };
    guidance.speakChakra(chakra);
    
    expect(utterances[0].voice.name).toBe('Lekha');
  });
});
